'use client';

import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  filterComponent?: React.ReactNode;
  actions?: React.ReactNode;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowsPerPageDefault?: number;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = 'Search...',
  searchKey,
  filterComponent,
  actions,
  emptyMessage = 'No items found.',
  onRowClick,
  rowsPerPageDefault = 10,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageDefault);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Search Filter
  const filteredData = useMemo(() => {
    if (!searchKey || !searchQuery.trim()) return data;
    return data.filter((item) => {
      const val = item[searchKey];
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchKey, searchQuery]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null); // Clear sorting
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden space-y-4">
      {/* Top Options Bar */}
      <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/20">
        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {searchKey && (
            <div className="relative max-w-md w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                <Icon name="MagnifyingGlassIcon" size={16} />
              </span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white rounded-xl focus:outline-none focus:border-neutral-950 dark:focus:border-neutral-50 transition-colors"
              />
            </div>
          )}
          {filterComponent}
        </div>
        <div className="flex gap-2 items-center justify-end">{actions}</div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-[10px] font-bold bg-neutral-50/30 dark:bg-neutral-950/10">
              {columns.map((col, idx) => {
                const isSortable = col.sortable && typeof col.accessor === 'string';
                const sortKey = (col.sortKey || col.accessor) as string;
                return (
                  <th
                    key={idx}
                    className={`px-6 py-4 font-bold select-none ${col.className || ''} ${
                      isSortable
                        ? 'cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200'
                        : ''
                    }`}
                    onClick={isSortable ? () => handleSort(sortKey) : undefined}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.header}
                      {isSortable && sortField === sortKey && (
                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-xs text-neutral-400 dark:text-neutral-500 italic"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`text-xs text-neutral-700 dark:text-neutral-300 transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/30'
                      : ''
                  }`}
                >
                  {columns.map((col, cIdx) => {
                    let cellVal: React.ReactNode;
                    if (typeof col.accessor === 'function') {
                      cellVal = col.accessor(row);
                    } else {
                      cellVal = row[col.accessor] as any;
                    }

                    return (
                      <td key={cIdx} className={`px-6 py-4 ${col.className || ''}`}>
                        {cellVal}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400 dark:text-neutral-500">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-40 transition-colors"
            >
              <Icon name="ChevronLeftIcon" size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pNum = i + 1;
              const isCurrent = currentPage === pNum;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pNum)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    isCurrent
                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-200 dark:bg-neutral-200 dark:text-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 disabled:opacity-40 transition-colors"
            >
              <Icon name="ChevronRightIcon" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
