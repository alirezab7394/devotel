import { useState, useEffect } from 'react';
import { FormStructure } from '../../types/form';
import { mockApi } from '../../api/mockApi';
import { Button } from '../ui/button';

interface FormSelectorProps {
  onSelectForm: (formId: string) => void;
}

export const FormSelector = ({ onSelectForm }: FormSelectorProps) => {
  const [formStructures, setFormStructures] = useState<FormStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormStructures = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getFormStructures();
        setFormStructures(data);
      } catch (err) {
        setError('Failed to load insurance forms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormStructures();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-lg">Loading insurance forms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Select Insurance Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formStructures.map((form) => (
          <div
            key={form.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{form.title}</h3>
              <p className="text-gray-500 mb-4">
                Apply for {form.type} insurance coverage.
              </p>
              <Button
                onClick={() => onSelectForm(form.id)}
                className="w-full"
              >
                Start Application
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 