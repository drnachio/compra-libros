import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const booksRouter = createTRPCRouter({
  getBookBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const result = await ctx.prisma.books.findFirst({
        select: {
          title: true,
          description: true,
          keyPoints: true,
          tags: true,
          article: true,
          coverImage: {
            select: {
              filename_disk: true,
              width: true,
              height: true,
              title: true,
            },
          },
          publishers: {
            select: {
              slug: true,
              name: true,
            },
          },
          authors: {
            select: {
              authors: {
                select: {
                  slug: true,
                  firstName: true,
                  lastName: true,
                  pictureFile: {
                    select: {
                      filename_disk: true,
                      width: true,
                      height: true,
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: {
          slug: input.slug,
        },
      });
      return result;
    }),
});
