import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { print } from 'graphql';

// Builds a remote schema executor function,
// customize any way that you need (auth, headers, etc).
// Expects to recieve an object with "document" and "variable" params,
// and asynchronously returns a JSON response from the remote.
export default async function createRemoteSchema({ url, ...filters }) {
  const executor = async ({ document, variables }) => {
    const query = print(document);
    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: {
        // We can also do Authentication here
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };

  return wrapSchema({
    schema: await introspectSchema(executor),
    executor,
    ...filters,
  });
}
