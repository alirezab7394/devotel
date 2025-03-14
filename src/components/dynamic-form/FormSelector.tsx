"use client";

import { useState } from "react";
import { DynamicFormConfig, DynamicFormValues } from "@/types/form";
import { DynamicForm } from "./DynamicForm";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { findFormById } from "@/lib/dynamic-form-utils";

interface FormSelectorProps {
  formConfigs: DynamicFormConfig[];
  onSubmit: (formId: string, values: DynamicFormValues) => void;
  isSubmitting?: boolean;
}

export function FormSelector({ formConfigs, onSubmit, isSubmitting = false }: FormSelectorProps) {
  const [selectedFormId, setSelectedFormId] = useState<string | undefined>(
    formConfigs.length > 0 ? formConfigs[0].formId : undefined
  );

  const handleFormSelect = (formId: string) => {
    setSelectedFormId(formId);
  };

  const handleSubmit = (values: DynamicFormValues) => {
    if (selectedFormId) {
      onSubmit(selectedFormId, values);
    }
  };

  const selectedForm = selectedFormId 
    ? findFormById(formConfigs, selectedFormId) 
    : undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="form-selector" className="text-sm font-medium">
          Select Form Type
        </label>
        <Select
          value={selectedFormId}
          onValueChange={handleFormSelect}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a form type" />
          </SelectTrigger>
          <SelectContent>
            {formConfigs.map((config) => (
              <SelectItem key={config.formId} value={config.formId}>
                {config.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedForm && (
        <div className="mt-6">
          <DynamicForm 
            formConfig={selectedForm} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
} 