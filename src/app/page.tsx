"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Advocate, ApiResponse, LoadingState } from "./types";
import Loader from "./components/Loader";
import Pagination from "./components/Pagination";
import SearchInput from "./components/SearchInput";
import AdvocatesTable from "./components/AdvocatesTable";
import { useDebounce } from "./hooks/useDebounce";

const PAGE_SIZE = 10;

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchAdvocates = useCallback(async (searchTerm: string) => {
    try {
      setLoadingState("loading");

      const params = new URLSearchParams({
        limit: PAGE_SIZE.toString(),
        offset: ((page - 1) * PAGE_SIZE).toString(),
      });

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/advocates?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch advocates");
      }

      const jsonResponse: ApiResponse<Advocate[]> = await response.json();

      if (jsonResponse.error) {
        throw new Error(jsonResponse.error);
      }

      if (!jsonResponse.data) {
        throw new Error("No data returned from API");
      }

      setAdvocates(jsonResponse.data);

      const total = jsonResponse.meta?.total || jsonResponse.data.length;
      setTotalItems(total);
      setTotalPages(Math.ceil(total / PAGE_SIZE));

      setLoadingState("success");
    } catch (error) {
      setLoadingState("error");
    }
  }, [page]);

  useEffect(() => {
    fetchAdvocates(debouncedSearchTerm);
  }, [debouncedSearchTerm, page, fetchAdvocates]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSearchReset = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const statusDisplay = useMemo(() => (
    <div className="mb-4 flex justify-end items-center">
      {totalItems > 0 ? (
        <p className="text-sm text-gray-500">
          {1 + (page - 1) * PAGE_SIZE} - {Math.min(page * PAGE_SIZE, totalItems)} of {totalItems} | Page {page} of {totalPages}
        </p>
      ) : (
        <p className="text-sm text-gray-500">No advocates found</p>
      )}
    </div>
  ), [totalItems, page, totalPages]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Solace Advocates</h1>

      <SearchInput
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onSearchReset={handleSearchReset}
        disabled={false}
      />
      {loadingState === "loading" && <Loader />}

      {loadingState === "success" && (
        <>
          {statusDisplay}

          <AdvocatesTable advocates={advocates} />

          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
            disabled={loadingState !== "success"}
          />
        </>
      )}
      {loadingState === "error" && <div>Error loading advocates</div>}
    </div>
  );
}
