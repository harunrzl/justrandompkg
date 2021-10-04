import { ReturnedDataType } from '../types';

const doFetch = async (url: string, opts: any) => {
  const { responseType = 'json', ...otherOpts } = opts || {};
  const returnedData: ReturnedDataType = { data: null, error: null, headers: null, status: 0 };

  try {
    const res = await fetch(url, otherOpts);
    returnedData.headers = res.headers;
    returnedData.status = res.status;
    returnedData.data = await res[responseType]();
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      returnedData.error = {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    }
  }

  return returnedData;
};

export default doFetch;
