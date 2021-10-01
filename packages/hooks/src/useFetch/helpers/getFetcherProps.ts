import isEmpty from '../utils/isEmpty';
import contentToURIParams from '../utils/contentToURIParams';

import { FetcherProps } from '../interface';

const getFetcherProps = (fetcherProps: FetcherProps): any[] => {
  const { body, headers, url, variables, ...opts } = fetcherProps;

  /** Variables will passed to body if available */
  const varIsExists = !isEmpty(variables);
  const methodToSend = opts.method || 'GET';
  const bodyToSend = varIsExists && methodToSend !== 'GET' ? JSON.stringify(variables) : body;
  const urlToSend = varIsExists && methodToSend === 'GET' ? `${url}?${contentToURIParams(variables || {})}` : url;

  return [
    urlToSend,
    {
      ...opts,
      ...(bodyToSend && { body: bodyToSend }),
      headers: {
        // Default set to application/json for string body
        ...((typeof body === 'string' || (varIsExists && methodToSend !== 'GET')) && {
          'Content-Type': 'application/json',
        }),

        // You can override it through headers though
        ...headers,
      },
    },
  ];
};

export default getFetcherProps;
