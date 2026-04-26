import React from 'react';

interface TourFilterProps {
  search: string;
  setSearch: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
}

export const TourFilter: React.FC<TourFilterProps> = ({ search, setSearch, filterStatus, setFilterStatus }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-2xl mx-auto">
      <div className="flex-1">
        <label htmlFor="city-search" className="sr-only">Išči mesto ali prizorišče</label>
        <input
          id="city-search"
          type="text"
          placeholder="Išči mesto ali prizorišče..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/20 text-primary placeholder-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        />
      </div>
      <div className="w-full sm:w-48">
        <label htmlFor="status-filter" className="sr-only">Filtriraj po statusu</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/20 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors appearance-none cursor-pointer"
        >
          <option value="all">Vsi datumi</option>
          <option value="available">Na voljo</option>
          <option value="limited">Zadnji kosi</option>
          <option value="sold-out">Razprodano</option>
        </select>
      </div>
    </div>
  );
};
