"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBar from "@/components/SearchBar/SearchBar";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./notes.module.css";

interface NotesProps {
  initialSearch: string;
  initialPage: number;
}

export default function Notes({ initialSearch, initialPage }: NotesProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes({ page, search }),
  });

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    params.set("page", "1");
    router.push(`/notes?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(newPage));
    router.push(`/notes?${params.toString()}`);
  };

  return (
    <div className={css.container}>
      <div className={css.topBar}>
        <h1 className={css.heading}>My Notes</h1>
        <div className={css.controls}>
          <SearchBar value={search} onSearch={handleSearch} />
          <button className={css.addBtn} onClick={() => setShowForm(true)}>
            + Add Note
          </button>
        </div>
      </div>

      {isLoading && <p>Loading, please wait...</p>}
      {isError && (
        <p>Could not fetch the list of notes. {(error as Error).message}</p>
      )}

      {data && (
        <>
          <NoteList notes={data.notes} />
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {showForm && <NoteForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
