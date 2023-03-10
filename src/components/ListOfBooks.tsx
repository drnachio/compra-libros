import ImageFromFile from './ImageFromFile';

import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import { api } from '../utils/api';
import Link from 'next/link';

const ListOfBooks: React.FC = () => {
  const books = api.books.getAllBooks.useQuery();
  const booksByLetter: { [letter: string]: typeof books.data } = {};
  if (books.data) {
    books.data.forEach((book) => {
      if (book.title) {
        const letter = book.title[0] as string;
        if (!booksByLetter[letter]) {
          booksByLetter[letter] = [];
        }
        booksByLetter[letter]?.push(book);
      }
    });
  }
  return (
    <aside className="hidden w-96 flex-shrink-0 border-r border-gray-200 xl:order-first xl:flex xl:flex-col">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-lg font-medium text-gray-900">Libros analizados</h2>
        <p className="mt-1 text-sm text-gray-600">
          Buscar en nuestro repositorio de 3 libros analizados
        </p>
        <form className="mt-6 flex space-x-4" action="#">
          <div className="min-w-0 flex-1">
            <label htmlFor="search" className="sr-only">
              Buscar
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                placeholder="Buscar"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <span className="sr-only">Search</span>
          </button>
        </form>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="Directory">
        {Object.keys(booksByLetter).map((letter) => (
          <div key={letter} className="relative">
            <div className="sticky top-0 z-10 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
              <h3>{letter}</h3>
            </div>
            <ul role="list" className="relative z-0 divide-y divide-gray-200">
              {booksByLetter[letter]?.map((book) => (
                <li key={book.slug}>
                  <div className="relative flex items-center space-x-3 px-6 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-pink-500 hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {book.coverImage && (
                        <ImageFromFile
                          className="w-10 h-auto"
                          file={book.coverImage}
                          width={40}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/libros/${book.slug || ''}`}
                        className="focus:outline-none"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">
                          {book.title}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {book.authors && book.authors.map(author => `${author?.authors?.firstName || ''} ${author?.authors?.lastName || ''}`)}
                        </p>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default ListOfBooks;
