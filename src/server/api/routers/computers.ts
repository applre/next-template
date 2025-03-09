import { publicProcedure, createTRPCRouter } from '@/server/api/trpc';
import { z } from 'zod';

// 这里可以定义 DTO
// .query(async ({ input, ctx }): Promise<ComputerDTO[]>
export const computersRouter = createTRPCRouter({
  getComputers: publicProcedure.input(z.object({ text: z.string() })).query(({ input }) => {
    // return [
    //   { id: 1, name: 'Apple I' },
    //   { id: 2, name: 'Apple II' },
    //   { id: 3, name: 'Macintosh' },
    // ];
    return {
      greeting: `Hello ${input.text}`,
    };
  }),
});
