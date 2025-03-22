import { env } from '@/env';
import { encode as base64Encode, decode as base64Decode } from 'base64-arraybuffer';

// Use Web Crypto API for Edge compatibility
const webcrypto = globalThis.crypto;

// Browser-compatible base64 encoding/decoding
function base64ToBase64Url(base64: string): string {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBase64(base64url: string): string {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return base64;
}

function encodeBase64(str: string): string {
  if (typeof window !== 'undefined') {
    return base64ToBase64Url(window.btoa(str));
  } else {
    return base64ToBase64Url(Buffer.from(str).toString('base64'));
  }
}

function decodeBase64(str: string): string {
  const base64 = base64UrlToBase64(str);
  if (typeof window !== 'undefined') {
    return window.atob(base64);
  } else {
    return Buffer.from(base64, 'base64').toString();
  }
}

// PASETO key types using Web Crypto API
export interface PasetoKeys {
  local: CryptoKey; // For encrypt/decrypt
  public: {
    privateKey: CryptoKey; // For signing
    publicKey: CryptoKey; // For verification
  };
}

// Convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert Uint8Array to string
function uint8ArrayToString(arr: Uint8Array): string {
  return new TextDecoder().decode(arr);
}

// Generate keys or load from environment
export async function getPasetoKeys(): Promise<PasetoKeys> {
  // For local operations (symmetric encryption)
  const localKeySecret = env.AUTH_SECRET || '';
  const localKeyMaterial = stringToUint8Array(localKeySecret.padEnd(32, '0').slice(0, 32));

  // Import the symmetric key
  const localKey = await webcrypto.subtle.importKey(
    'raw',
    localKeyMaterial,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );

  // For public operations (asymmetric signing)
  let keyPair: CryptoKeyPair;

  try {
    // Generate new Ed25519-like key pair (using ECDSA P-256 as fallback for Web Crypto API)
    keyPair = await webcrypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['sign', 'verify'],
    );

    console.warn('Generated new PASETO keys - these should be stored securely');
  } catch (error) {
    console.error('Failed to generate keys:', error);
    throw error;
  }

  return {
    local: localKey,
    public: {
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    },
  };
}

// Simple PASETO-like token format
async function createSignature(payload: string, key: CryptoKey): Promise<string> {
  const data = stringToUint8Array(payload);
  const signature = await webcrypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    key,
    data,
  );
  return base64Encode(signature);
}

async function verifySignature(
  payload: string,
  signature: string,
  key: CryptoKey,
): Promise<boolean> {
  const data = stringToUint8Array(payload);
  const signatureBuffer = base64Decode(signature);
  return await webcrypto.subtle.verify(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    key,
    signatureBuffer,
    data,
  );
}

// Utility to create auth tokens
export async function createToken(
  payload: Record<string, unknown>,
  expiresIn = '1d',
): Promise<string> {
  const keys = await getPasetoKeys();

  // Calculate expiration time
  const now = new Date();
  const exp = new Date(now);

  // Parse expiration time (e.g., '1d', '4h', '30m')
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (match) {
    const [, amount, unit] = match;
    switch (unit) {
      case 'd':
        exp.setDate(exp.getDate() + parseInt(amount));
        break;
      case 'h':
        exp.setHours(exp.getHours() + parseInt(amount));
        break;
      case 'm':
        exp.setMinutes(exp.getMinutes() + parseInt(amount));
        break;
      case 's':
        exp.setSeconds(exp.getSeconds() + parseInt(amount));
        break;
    }
  }

  // Create the payload with expiration
  const tokenPayload = {
    ...payload,
    exp: Math.floor(exp.getTime() / 1000),
    iat: Math.floor(now.getTime() / 1000),
  };

  // Stringify the payload
  const payloadStr = JSON.stringify(tokenPayload);

  // Create signature
  const signature = await createSignature(payloadStr, keys.public.privateKey);

  // Combine payload and signature (base64 encoded)
  const encodedPayload = encodeBase64(payloadStr);
  return `${encodedPayload}.${signature}`;
}

// Verify and decode token
export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) {
      throw new Error('Invalid token format');
    }

    // Decode the payload
    const payloadStr = decodeBase64(encodedPayload);
    const payload = JSON.parse(payloadStr) as Record<string, unknown>;

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp < now) {
      throw new Error('Token expired');
    }

    // Verify signature
    const keys = await getPasetoKeys();
    const isValid = await verifySignature(payloadStr, signature, keys.public.publicKey);

    if (!isValid) {
      throw new Error('Invalid signature');
    }

    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
