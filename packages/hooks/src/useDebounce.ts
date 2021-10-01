import { useRef, useState, useEffect } from 'react';

export default function useDebounce(value: any, delay = 500, cb?: () => void) {
  const [debounceValue, setDebounceValue] = useState(value);
  const previousValue = useRef(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (previousValue.current !== value) {
        setDebounceValue(value);
        previousValue.current = value;

        if (cb) {
          cb();
        }
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, cb]);

  return debounceValue;
}
