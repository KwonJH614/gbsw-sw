import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (query.length > 0 && query.length < 2) return;

    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="강의 검색 (2자 이상)"
      className="w-full max-w-md rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
    />
  );
}
