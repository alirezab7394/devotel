import { memo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FormSubmissionsResponse } from "@/services/apiService";
import { Button } from "@/components/ui/button";

interface CustomizeColumnsProps {
  submissions: FormSubmissionsResponse | null;
  visibleColumns: string[];
  toggleColumnVisibility: (column: string) => void;
}

function CustomizeColumns({ submissions, visibleColumns, toggleColumnVisibility }: CustomizeColumnsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className="bg-transparent" variant="outline">
          Customize Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-xs">
        <DropdownMenuLabel>Select columns to display</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submissions?.columns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={visibleColumns.includes(column)}
            onCheckedChange={() => toggleColumnVisibility(column)}
            key={column}
          >
            {column}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default memo(CustomizeColumns);
