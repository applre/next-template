import { db } from '@/server/db';
import { users, verificationTokens } from '@/server/db/schema/auth';
import { eq } from 'drizzle-orm';

export const getTokenByEmail = async (email: string) => {
  try {
    const [token] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.identifier, email));

    return token;
  } catch (error) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return user;
  } catch (error) {
    return null;
  }
};

export const delVerificationTokensByIdentifier = async (identifier: string) => {
  try {
    const [token] = await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, identifier))
      .returning();

    return token;
  } catch (error) {
    return null;
  }
};
