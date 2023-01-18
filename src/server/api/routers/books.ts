import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '../trpc';

export const booksRouter = createTRPCRouter({
  getAllBooks: publicProcedure.query(async ({ ctx }) =>
    ctx.prisma.books.findMany({
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
              },
            },
          },
          where: {
            authors: {
              status: 'published',
            },
          },
          orderBy: {
            authors: {
              lastName: 'asc',
            },
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
      where: {
        status: 'published',
      },
    }),
  ),
  getBookBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) =>
      ctx.prisma.books.findFirst({
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
            where: {
              authors: {
                status: 'published',
              },
            },
            orderBy: {
              authors: {
                lastName: 'asc',
              },
            },
          },
          booksVersions: {
            select: {
              type: true,
              amazonAffiliateURL: true,
              asin: true,
              dimensions: true,
              editionDate: true,
              editionNumber: true,
              fileSize: true,
              isbn10: true,
              isbn13: true,
              pages: true,
              weight: true,
            },
            where: {
              status: 'published',
            },
            orderBy: [{ type: 'asc' }, { editionNumber: 'desc' }],
          },
        },
        where: {
          slug: input.slug,
        },
      }),
    ),
});
