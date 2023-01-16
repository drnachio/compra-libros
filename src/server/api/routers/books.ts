import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const booksRouter = createTRPCRouter({
  getBookBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.books.findFirst({
        select: {
          title: true,
        },
        where: {
          slug: input.slug,
        },
      });
      return result;
    }),
});
