'use server';

import { db } from '@/server/db';
import { users } from '@/server/db/schema/auth';
import { eq } from 'drizzle-orm';
import { createServerActionProcedure } from 'zsa';
import { z } from 'zod';
import { handleAuthError } from '@/server/error/auth';

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

interface UpdateUserResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export const updateUser = createServerActionProcedure()
  .handler(async (): Promise<UpdateUserResponse> => {
    return { success: false };
  })
  .createServerAction()
  .input(updateUserSchema)
  .handler(async (input) => {
    const { id, name, email } = input.input;

    try {
      const updateData: Partial<typeof users.$inferInsert> = {};

      if (name !== undefined) {
        updateData.name = name;
      }

      if (email !== undefined) {
        updateData.email = email;
      }

      if (Object.keys(updateData).length === 0) {
        return { success: false, error: 'No data to update' };
      }

      updateData.updatedAt = new Date();

      await db.update(users).set(updateData).where(eq(users.id, id));
      
      return { success: true };
    } catch (error) {
      const result = handleAuthError(error);
      return { success: false, ...result };
    }
  });
