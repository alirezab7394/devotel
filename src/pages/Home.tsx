import { PATHNAMES } from '@/constants/pathnames';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">

      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-6">Dynamic Form System</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-medium mb-2">Add Applications</h3>
            <p className="text-gray-600 mb-4">
              Add new applications to the system.
            </p>
            <Link to={PATHNAMES.DYNAMIC_FORM_DEMO} className="text-blue-600 hover:text-blue-800">Add Applications &rarr;</Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-medium mb-2">View Applications</h3>
            <p className="text-gray-600 mb-4">
              Access all submitted applications with advanced filtering, sorting, and column customization.
            </p>
            <Link to={PATHNAMES.APPLICATIONS} className="text-blue-600 hover:text-blue-800">View Applications &rarr;</Link>
          </div>

        </div>
      </div>
    </div>
  );
} 