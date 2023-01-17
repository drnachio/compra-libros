import Link from 'next/link';

import { ChevronLeftIcon, ShoppingBagIcon } from '@heroicons/react/20/solid';

import Layout from '../../components/Layout';
import { profile, tabs } from '../../data/data';
import ListOfBooks from '../../components/ListOfBooks';
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { PrismaClient } from '@prisma/client';

import { api } from '../../utils/api';
import staticSsgHelper from '../../server/staticSsgHelper';
import Head from 'next/head';
import getImageUrlFromFile from '../../utils/getImageUrlFromFile';
import ImageFromFile from '../../components/ImageFromFile';
import Markdown from '../../components/Markdown';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type PropsType = InferGetStaticPropsType<typeof getStaticProps>;

const Libro: React.FC<PropsType> = ({ slug }) => {
  const bookDetails = api.books.getBookBySlug.useQuery({ slug });
  const tags = (bookDetails?.data?.tags as string[]) || undefined;
  return (
    <Layout>
      <Head>
        <title>{`${bookDetails?.data?.title || ''}`}</title>
        <meta
          name="title"
          property="og:title"
          content={`${bookDetails?.data?.title || ''}`}
        />
        <meta
          name="description"
          property="og:description"
          content={`${
            bookDetails?.data?.description || bookDetails?.data?.title || ''
          }`}
        />
        {tags && <meta name="keywords" content={tags.join(', ')} />}
        {bookDetails?.data?.coverImage && (
          <meta
            property="og:image"
            content={getImageUrlFromFile(bookDetails?.data?.coverImage)}
          />
        )}
      </Head>
      <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
        {/* Breadcrumb */}
        <nav
          className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden"
          aria-label="Breadcrumb"
        >
          <a
            href="#"
            className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
          >
            <ChevronLeftIcon
              className="-ml-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <span>Libros analizados</span>
          </a>
        </nav>

        <article>
          {/* Profile header */}
          <div>
            <div className="h-32 w-full bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400"></div>
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="-mt-28 sm:-mt-28 sm:flex sm:items-end sm:space-x-5">
                <div className="flex relative">
                  {bookDetails?.data?.coverImage && (
                    <ImageFromFile
                      className="w-24 sm:w-28 h-auto mx-auto drop-shadow-xl bottom-0 left-0 relative shadow-black"
                      file={bookDetails.data.coverImage}
                      width={112}
                    />
                  )}
                </div>
                <div className="sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                    <h1 className="truncate text-2xl font-bold text-gray-900">
                      {bookDetails.data
                        ? bookDetails.data.title
                        : 'Cargando...'}{' '}
                    </h1>
                  </div>
                  <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <ShoppingBagIcon
                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Comprar en Amazon</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {bookDetails.data ? bookDetails.data.title : 'Cargando...'}{' '}
                </h1>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 sm:mt-2 2xl:mt-5">
            <div className="border-b border-gray-200">
              <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      className={classNames(
                        tab.current
                          ? 'border-pink-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                      )}
                      aria-current={tab.current ? 'page' : undefined}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Description list */}
          <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              {Object.keys(profile.fields).map((field) => (
                <div key={field} className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">{field}</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(profile.fields as { [key: string]: string })[field]}
                  </dd>
                </div>
              ))}
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Comentario
                </dt>
                <dd>
                  <Markdown>{bookDetails.data?.article || ''}</Markdown>
                </dd>
                <dt className="text-sm font-medium text-gray-500">
                  Principales razones para leerlo
                </dt>
                <dd>
                  <Markdown>{bookDetails.data?.keyPoints || ''}</Markdown>
                </dd>
                <dt className="text-sm font-medium text-gray-500">
                  Descripción del editor
                </dt>
                <dd>
                  <Markdown>{bookDetails.data?.description || ''}</Markdown>
                </dd>
              </div>
            </dl>
          </div>

          {/* Team member list */}
          <div className="mx-auto mt-8 max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
            <h2 className="text-sm font-medium text-gray-500">
              Autoras y autores
            </h2>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {bookDetails?.data?.authors.map(({ authors }) => (
                <div
                  key={authors?.slug}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2 hover:border-gray-400"
                >
                  <div className="flex-shrink-0">
                    {authors?.pictureFile && (
                      <ImageFromFile
                        className="h-10 w-10 object-cover rounded-full"
                        file={authors?.pictureFile}
                        width={40}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/autores/${authors?.slug || ''}`}
                      title={`${authors?.firstName || ''} ${
                        authors?.lastName || ''
                      }`}
                      className="focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">
                        {authors?.firstName}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {authors?.lastName}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </main>
      <ListOfBooks />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const prismaClient = new PrismaClient();
  const pathsData = await prismaClient.books.findMany({
    select: {
      slug: true,
    },
  });

  const paths: { params: { slug: string } }[] = [];

  pathsData.forEach((path) => {
    paths.push({
      params: {
        slug: path.slug || '',
      },
    });
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<{ slug: string }> = async ({
  params,
}) => {
  const slug = (params?.slug as string) || '';
  const ssg = staticSsgHelper();
  await ssg.books.getBookBySlug.prefetch({ slug });
  return {
    props: {
      slug: (params?.slug as string) || '',
      trpcState: ssg.dehydrate(),
    },
  };
};

export default Libro;
