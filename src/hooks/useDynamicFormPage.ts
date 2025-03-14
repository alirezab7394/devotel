import { useState, useEffect } from "react";
import { DynamicFormValues } from "@/types/form";
import { fetchFormConfigurations, submitFormToApi } from "@/services/apiService";
import { DynamicFormConfig } from "@/types/form";

export const useDynamicFormPage = () => {
    const [submittedData, setSubmittedData] = useState<{
        formId: string;
        values: DynamicFormValues;
        submissionId?: string;
    } | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [apiFormConfigs, setApiFormConfigs] = useState<DynamicFormConfig[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFormConfigurations = async () => {
            setIsLoading(true);
            try {
                const configs = await fetchFormConfigurations();
                setApiFormConfigs(configs as DynamicFormConfig[]);
                setError(null);
            } catch (err) {
                console.error("Error fetching form configurations:", err);
                setError("Failed to load form configurations. Using fallback data.");
                // Keep using the default formConfigs as fallback
            } finally {
                setIsLoading(false);
            }
        };

        loadFormConfigurations();
    }, []);

    const handleFormSubmit = async (formId: string, values: DynamicFormValues) => {
        setIsSubmitting(true);

        try {
            // Submit the form data to our API
            const result = await submitFormToApi(formId, values);

            // Update the UI with the submitted data and submission ID
            setSubmittedData({
                formId,
                values,
                submissionId: result.id
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            // In a real application, you would show an error message to the user
        } finally {
            setIsSubmitting(false);
        }
    };
    return {
        submittedData,
        isSubmitting,
        isLoading,
        apiFormConfigs,
        error,
        handleFormSubmit
    }
}