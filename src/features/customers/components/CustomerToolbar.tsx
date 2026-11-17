"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { Input } from "@/ui/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/primitives/select";
import { SEARCH_DEBOUNCE_MS } from "../constants";
import type { CustomerFilters, CustomerStatusFilter } from "../types";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] satisfies { value: CustomerStatusFilter; label: string }[];

interface CustomerToolbarProps {
  filters: CustomerFilters;
  onChange: (changes: Partial<CustomerFilters>) => void;
}

export function CustomerToolbar({ filters, onChange }: CustomerToolbarProps) {
  const [search, setSearch] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debouncedSearch !== filters.search)
      onChange({ search: debouncedSearch });
  }, [debouncedSearch, filters.search, onChange]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email or company"
          aria-label="Search customers"
          className="pl-8"
        />
      </div>
      <Select
        items={STATUS_OPTIONS}
        value={filters.status}
        onValueChange={(status) => {
          if (status) onChange({ status });
        }}
      >
        <SelectTrigger aria-label="Filter by status" className="sm:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
