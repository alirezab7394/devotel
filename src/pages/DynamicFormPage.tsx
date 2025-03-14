import { FormSelector } from "@/components/dynamic-form/FormSelector";
import { useDynamicFormPage } from "@/hooks/useDynamicFormPage";

export default function DynamicFormDemo() {
  const { submittedData, isSubmitting, isLoading, apiFormConfigs, error, handleFormSubmit } = useDynamicFormPage();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading form configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dynamic Form Demo</h1>

      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-background p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Form</h2>
          <FormSelector formConfigs={apiFormConfigs} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
        </div>

        <div className="bg-background p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Submitted Data</h2>
          {submittedData ? (
            <div>
              <div className="mb-4">
                <span className="font-medium">Form ID:</span> {submittedData.formId}
              </div>
              {submittedData.submissionId && (
                <div className="mb-4">
                  <span className="font-medium">Submission ID:</span> {submittedData.submissionId}
                </div>
              )}
              <div>
                <span className="font-medium">Values:</span>
                <pre className="mt-2 p-4 bg-muted rounded-md overflow-auto max-h-[500px]">
                  {JSON.stringify(submittedData.values, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              No data submitted yet. Fill out and submit the form to see the results here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
