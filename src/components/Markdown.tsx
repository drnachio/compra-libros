import ReactMarkdown from 'react-markdown';
import type { ReactElement, ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import markdownComponents from './markdown/markdownComponents';

const MarkDown = (options: ReactMarkdownOptions): ReactElement => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ReactMarkdown {...options} components={markdownComponents} />
);
export default MarkDown;
