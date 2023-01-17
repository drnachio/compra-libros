import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const booksRouter = createTRPCRouter({
  getAllBooks: publicProcedure.query(
    async ({ ctx }) => {
      const result = await ctx.prisma.books.findMany({
        select: {
          title: true,
          slug: true,
          coverImage: {
            select: {
              filename_disk: true,
              width: true,
              height: true,
              title: true,
            },
          },
          authors: {
            select: {
              authors: {
                select: {
                  slug: true,
                  firstName: true,
                  lastName: true,
                }
              }
            }
          },
        },
        orderBy: {
          title: 'asc',
        },
        where: {
          status: 'published'
        },
      });
      return result;
    }
  ),
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
          abstract: true,
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
