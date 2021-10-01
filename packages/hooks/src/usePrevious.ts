import { useEffect, useRef } from 'react';

/**
 * Get the previous value of props or state, for example in `componentDidUpdate` case.
 * The ref object is a generic container whose current property is mutable.
 * The param can hold any value, similar to an instance property on a class.
 * @param {any} value The state or props to be tracked.
 * @returns {any} Return previous value (happens before update in `useEffect` in the function)
 * @example
 * import usePrevious from '@hooks/usePrevious';
 *
 * const prevChip = usePrevious(activeChip);
 *
 * useEffect(() => {
 *  if (activeChip !== prevChip) {
 *    // do any logic here.
 *  }
 * }, [activeChip, prevChip]);
 */
const usePrevious = (value: any) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;
