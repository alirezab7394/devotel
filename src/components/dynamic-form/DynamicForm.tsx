"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  DynamicFormConfig, 
  DynamicFormField, 
  DynamicFormValues 
} from "@/types/form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DynamicField } from "./DynamicField";
import { getInitialValues, isFieldVisible } from "@/lib/dynamic-form-utils";

interface DynamicFormProps {
  formConfig: DynamicFormConfig;
  onSubmit: (values: DynamicFormValues) => void;
  defaultValues?: DynamicFormValues;
  isSubmitting?: boolean;
}

export function DynamicForm({ 
  formConfig, 
  onSubmit, 
  defaultValues = {},
  isSubmitting = false
}: DynamicFormProps) {
  const [formValues, setFormValues] = useState<DynamicFormValues>(
    defaultValues || getInitialValues(formConfig.fields)
  );

  // Create a dynamic Zod schema based on the form fields
  const generateZodSchema = (fields: DynamicFormField[], currentValues: DynamicFormValues): z.ZodObject<any> => {
    const schemaMap: Record<string, z.ZodTypeAny> = {};

    const processFields = (fields: DynamicFormField[]) => {
      fields.forEach(field => {
        if (field.type === 'group') {
          // Process nested fields in the group
          processFields(field.fields);
        } else {
          let fieldSchema: z.ZodTypeAny;

          // Create the appropriate Zod schema based on field type
          switch (field.type) {
            case 'text':
              fieldSchema = z.string();
              if (field.validation?.pattern) {
                fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(field.validation.pattern));
              }
              break;
            case 'number':
              // Use string schema first, then transform to number
              fieldSchema = z.string()
                .transform((val) => val === '' ? undefined : Number(val))
                .pipe(
                  z.number().optional()
                );
                
              if (field.validation?.min !== undefined) {
                fieldSchema = fieldSchema.pipe(
                  z.number().min(field.validation.min).optional()
                );
              }
              
              if (field.validation?.max !== undefined) {
                fieldSchema = fieldSchema.pipe(
                  z.number().max(field.validation.max).optional()
                );
              }
              break;
            case 'date':
              // Use string schema for date fields, as we store them as ISO strings
              fieldSchema = z.string()
                .refine(
                  (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), 
                  { message: "Invalid date format" }
                );
              break;
            case 'select':
              fieldSchema = z.string();
              break;
            case 'radio':
              fieldSchema = z.string();
              break;
            case 'checkbox':
              fieldSchema = z.array(z.string());
              break;
            default:
              fieldSchema = z.any();
          }

          // Check if field is visible before applying required validation
          const isVisible = isFieldVisible(field, currentValues);
          
          // Add required validation if needed and field is visible
          if (field.required && isVisible) {
            if (field.type === 'checkbox') {
              fieldSchema = z.array(z.string()).min(1, { message: `${field.label} is required` });
            } else if (field.type === 'text' || field.type === 'select' || field.type === 'radio' || field.type === 'date') {
              fieldSchema = z.string().min(1, { message: `${field.label} is required` });
            } else if (field.type === 'number') {
              fieldSchema = z.string()
                .min(1, { message: `${field.label} is required` })
                .transform((val) => Number(val))
                .pipe(z.number());
              
              if (field.validation?.min !== undefined) {
                fieldSchema = fieldSchema.pipe(
                  z.number().min(field.validation.min)
                );
              }
              
              if (field.validation?.max !== undefined) {
                fieldSchema = fieldSchema.pipe(
                  z.number().max(field.validation.max)
                );
              }
            }
          } else {
            // Make the field optional
            if (field.type === 'checkbox') {
              fieldSchema = z.array(z.string()).optional();
            } else if (field.type === 'number') {
              fieldSchema = z.string()
                .transform((val) => val === '' ? undefined : Number(val))
                .pipe(z.number().optional());
              
              if (field.validation?.min !== undefined) {
                fieldSchema = fieldSchema.pipe(
                  z.number().min(field.validation.min).optional()
                );
              }
              
              if (field.validation?.max !== undefined) {
                fieldSchema = fieldSchema.pipe(
                  z.number().max(field.validation.max).optional()
                );
              }
            } else {
              fieldSchema = z.string().optional();
            }
          }

          schemaMap[field.id] = fieldSchema;
        }
      });
    };

    processFields(fields);
    return z.object(schemaMap);
  };

  // Generate the form schema based on current form values
  const formSchema = useMemo(() => {
    return generateZodSchema(formConfig.fields, formValues);
  }, [formConfig.fields, formValues]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
    mode: "onChange", // Validate on change to update validation as visibility changes
  });

  // Update form values when the form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as DynamicFormValues);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle form submission
  const handleSubmit = (values: DynamicFormValues) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{formConfig.title}</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {formConfig.fields.map((field) => (
            <DynamicField 
              key={field.id} 
              field={field} 
              formValues={formValues}
              disabled={isSubmitting}
            />
          ))}
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 