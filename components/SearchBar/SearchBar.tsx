'use client';

import { useEffect, useState } from 'react';
import css from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
}

export default function SearchBar({ value, onSearch }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue.trim());
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        className={css.input}
        type="text"
        placeholder="Search notes..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className={css.button} type="submit">
        Search
      </button>
    </form>
  );
}
