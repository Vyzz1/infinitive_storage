"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Filter } from "lucide-react";

interface SortFilterBarProps {
  sortBy: string;
  sortOrder: "asc" | "desc";
  filterType: string | null;
  onSortByChange: (value: string) => void;
  onSortOrderChange: (value: "asc" | "desc") => void;
  onFilterTypeChange: (value: string | null) => void;
}

export function SortFilterBar({
  sortBy,
  sortOrder,
  filterType,
  onSortByChange,
  onSortOrderChange,
  onFilterTypeChange,
}: SortFilterBarProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortBy} onValueChange={onSortByChange}>
            <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="createdAt">
              Date created
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="updatedAt">
              Date modified
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="type">Type</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Order</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={sortOrder}
            onValueChange={(value) => onSortOrderChange(value as "asc" | "desc")}
          >
            <DropdownMenuRadioItem value="asc">
              Ascending
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">
              Descending
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter {filterType && `(${filterType})`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filterType || "all"}
            onValueChange={(value) =>
              onFilterTypeChange(value === "all" ? null : value)
            }
          >
            <DropdownMenuRadioItem value="all">All files</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="image">Images</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="video">Videos</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="audio">Audio</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="pdf">PDFs</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="document">
              Documents
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="code">Code</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}