import { ApplicationsTable } from '../components/ApplicationsTable/ApplicationsTable';

export default function Applications() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Submitted Applications</h1>
        <p className="text-gray-600">View and manage all submitted insurance applications</p>
      </div>
      <ApplicationsTable />
    </div>
  );
} 