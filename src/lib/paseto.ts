import { env } from '@/env';
import {
  encode as base64ArrayBufferEncode,
  decode as base64ArrayBufferDecode,
} from 'base64-arraybuffer';
import { encodeBase64url, decodeBase64url } from '@oslojs/encoding';

// Use Web Crypto API for Edge compatibility
const webcrypto = globalThis.crypto;

// Convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

// Convert Uint8Array to string
function uint8ArrayToString(arr: Uint8Array): string {
  return new TextDecoder().decode(arr);
}

// Convert ArrayBuffer to Uint8Array
function arrayBufferToUint8Array(buffer: ArrayBuffer): Uint8Array {
  return new Uint8Array(buffer);
}

// PASETO key types using Web Crypto API
export interface PasetoKeys {
  local: CryptoKey; // For encrypt/decrypt
  public: {
    privateKey: CryptoKey; // For signing
    publicKey: CryptoKey; // For verification
  };
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
  const signatureBytes = arrayBufferToUint8Array(signature);
  return encodeBase64url(signatureBytes);
}

async function verifySignature(
  payload: string,
  signature: string,
  key: CryptoKey,
): Promise<boolean> {
  const data = stringToUint8Array(payload);
  const signatureBytes = decodeBase64url(signature);
  return await webcrypto.subtle.verify(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    key,
    signatureBytes,
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
  const encodedPayload = encodeBase64url(stringToUint8Array(payloadStr));
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
    const payloadBytes = decodeBase64url(encodedPayload);
    const payloadStr = uint8ArrayToString(payloadBytes);
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
