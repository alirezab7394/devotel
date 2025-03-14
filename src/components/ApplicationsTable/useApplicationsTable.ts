import { useState, useEffect } from 'react';
import { fetchFormSubmissions, FormSubmissionsResponse } from '../../services/apiService';

interface UseApplicationsTableProps {
  initialItemsPerPage?: number;
}

interface UseApplicationsTableReturn {
  submissions: FormSubmissionsResponse | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (columnId: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  visibleColumns: string[];
  toggleColumnVisibility: (columnName: string) => void;
  filteredSubmissions: Array<{ id: string;[key: string]: string | number }>;
  paginatedSubmissions: Array<{ id: string;[key: string]: string | number }>;
  totalPages: number;
}

export const useApplicationsTable = ({
  initialItemsPerPage = 10
}: UseApplicationsTableProps = {}): UseApplicationsTableReturn => {
  const [submissions, setSubmissions] = useState<FormSubmissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const data = await fetchFormSubmissions();
        setSubmissions(data);
        // Initialize visible columns with all columns from the API
        setVisibleColumns(data.columns);
      } catch (err) {
        setError('Failed to load submissions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  // Filter submissions based on search term
  const filteredSubmissions = submissions?.data.filter((submission) => {
    if (!searchTerm) return true;

    return Object.values(submission).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }) || [];

  // Sort submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (!sortColumn) return 0;

    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }

    const strA = String(valueA || '').toLowerCase();
    const strB = String(valueB || '').toLowerCase();

    if (sortDirection === 'asc') {
      return strA.localeCompare(strB);
    } else {
      return strB.localeCompare(strA);
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);
  const paginatedSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle sort
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnName: string) => {
    setVisibleColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(col => col !== columnName)
        : [...prev, columnName]
    );
  };

  return {
    submissions,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    visibleColumns,
    toggleColumnVisibility,
    filteredSubmissions,
    paginatedSubmissions,
    totalPages
  };
}; 