import { useState, useEffect, useRef } from 'react';

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);
  const goToPage = (p) => setPage(p);
  const nextPage = () => setPage((prev) => prev + 1);
  const prevPage = () => setPage((prev) => Math.max(1, prev - 1));
  const resetPage = () => setPage(1);
  return { page, goToPage, nextPage, prevPage, resetPage };
}
