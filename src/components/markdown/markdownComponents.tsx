import type { ReactNode } from 'react';

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }): JSX.Element => (
    <p className="mt-5">
      <span>{children}</span>
    </p>
  ),
  strong: ({ children }: { children?: ReactNode }): JSX.Element => (
    <strong className="font-semibold text-pink-800">
      {children}
    </strong>
  ),
  em: ({ children }: { children?: ReactNode }): JSX.Element => (
    <em className="text-pink-800 italic">{children}</em>
  ),
  h1: ({ children }: { children?: ReactNode }): JSX.Element => (
    <h1 className="text-2xl font-bold text-gray-900">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }): JSX.Element => (
    <h2 className="text-xl font-bold text-gray-900">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }): JSX.Element => (
    <h3 className="text-lg font-bold text-gray-900">{children}</h3>
  ),
  h4: ({ children }: { children?: ReactNode }): JSX.Element => (
    <h4 className="text-lg font-semibold">{children}</h4>
  ),
  ul: ({ children }: { children?: ReactNode }): JSX.Element => (
    <ul className="list-disc">{children}</ul>
  ),
  li: ({ children }: { children?: ReactNode }): JSX.Element => (
    <li className="mt-2 ml-5">{children}</li>
  ),
  a: ({
    children,
    href,
  }: {
    children?: ReactNode;
    href?: string;
  }): JSX.Element => (
    <a
      href={href}
      className="font-semibold text-pink-800 dark:text-primary cursor-pointer"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
};

export default markdownComponents;
