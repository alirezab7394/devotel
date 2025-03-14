import { DynamicField } from '../DynamicField/DynamicField';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useDynamicForm } from './useDynamicForm';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface DynamicFormProps {
  formId: string;
  onSuccess?: () => void;
}

export const DynamicForm = ({ formId, onSuccess }: DynamicFormProps) => {
  const {
    form,
    formStructure,
    loading,
    error,
    submitting,
    submitSuccess,
    shouldShowField,
    onSubmit,
  } = useDynamicForm(formId);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-lg">Loading form...</div>
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

  if (!formStructure) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        <p>Form not found</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{formStructure.title}</h1>
        <p className="text-gray-500 mt-1">
          Please fill out the form below to apply for {formStructure.type} insurance.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          {formStructure.sections.map((section) => (
            <div key={section.id} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <Separator className="mt-2" />
              </div>
              
              <div className="space-y-6">
                {section.fields.map((field) => (
                  <DynamicField
                    key={field.id}
                    field={field}
                    form={form}
                    shouldShow={shouldShowField(field)}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={submitSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Application Submitted</AlertDialogTitle>
            <AlertDialogDescription>
              Your insurance application has been submitted successfully. You can view the status of your application in the Applications section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              if (onSuccess) {
                onSuccess();
              }
            }}>
              View Applications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}; 