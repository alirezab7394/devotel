import { useState } from 'react';
import { FormSelector } from '../components/FormSelector/FormSelector';
import { DynamicForm } from '../components/DynamicFormContainer/DynamicForm';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { ApplicationsTable } from '@/components/ApplicationsTable/ApplicationsTable';

enum View {
  HOME,
  FORM,
  APPLICATIONS,
}

export const HomePage = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  const handleSelectForm = (formId: string) => {
    setSelectedFormId(formId);
    setView(View.FORM);
  };

  const handleFormSuccess = () => {
    setView(View.APPLICATIONS);
  };

  const renderContent = () => {
    switch (view) {
      case View.HOME:
        return <FormSelector onSelectForm={handleSelectForm} />;
      case View.FORM:
        return selectedFormId ? (
          <DynamicForm formId={selectedFormId} onSuccess={handleFormSuccess} />
        ) : (
          <div>No form selected</div>
        );
      case View.APPLICATIONS:
        return <ApplicationsTable />;
      default:
        return <FormSelector onSelectForm={handleSelectForm} />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Smart Insurance Application Portal</h1>
        <p className="text-gray-500 mt-2">
          Apply for insurance coverage and manage your applications in one place.
        </p>
      </header>

      <div className="mb-8">
        <div className="flex space-x-4">
          <Button
            variant={view === View.HOME ? 'default' : 'outline'}
            onClick={() => setView(View.HOME)}
          >
            New Application
          </Button>
          <Button
            variant={view === View.APPLICATIONS ? 'default' : 'outline'}
            onClick={() => setView(View.APPLICATIONS)}
          >
            My Applications
          </Button>
        </div>
        <Separator className="my-4" />
      </div>

      {renderContent()}
    </div>
  );
}; 