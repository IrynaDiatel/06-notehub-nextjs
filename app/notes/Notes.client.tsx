"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBar from "@/components/SearchBar/SearchBar";
import Pagination from "@/components/Pagination/Pagination";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import css from "./notes.module.css";

export default function Notes() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes({ page, search }),
  });

  const handleSearch = useDebouncedCallback((query: string) => {
    setSearch(query);
    setPage(1);
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    params.set("page", "1");
    router.push(`/notes?${params.toString()}`);
  }, 300);

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
          {data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <NoteForm onClose={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
