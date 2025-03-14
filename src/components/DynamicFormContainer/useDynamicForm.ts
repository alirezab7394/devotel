import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormStructure, FormField, FieldCondition, FormData } from '../../types/form';
import { mockApi } from '../../api/mockApi';

export const useDynamicForm = (formId: string) => {
  const [formStructure, setFormStructure] = useState<FormStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dynamicSchema, setDynamicSchema] = useState<z.ZodObject<any>>(z.object({}));
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(dynamicSchema),
    mode: 'onChange',
  });

  const { watch } = form;
  const formValues = watch();

  // Fetch form structure
  useEffect(() => {
    const fetchFormStructure = async () => {
      try {
        setLoading(true);
        const data = await mockApi.getFormStructure(formId);
        if (data) {
          setFormStructure(data);
        } else {
          setError('Form not found');
        }
      } catch (err) {
        setError('Failed to load form');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormStructure();
  }, [formId]);

  // Build Zod schema based on form structure
  useEffect(() => {
    if (!formStructure) return;

    const buildFieldSchema = (field: FormField): z.ZodTypeAny => {
      let schema: z.ZodTypeAny;

      switch (field.type) {
        case 'text':
          schema = z.string();
          if (field.validation?.pattern) {
            schema = (schema as z.ZodString).regex(new RegExp(field.validation.pattern), field.validation.message);
          }
          break;
        case 'number':
          schema = z.number();
          if (field.validation?.min !== undefined) {
            schema = (schema as z.ZodNumber).min(field.validation.min, field.validation.message);
          }
          if (field.validation?.max !== undefined) {
            schema = (schema as z.ZodNumber).max(field.validation.max, field.validation.message);
          }
          break;
        case 'checkbox':
          schema = z.array(z.string());
          break;
        case 'date':
          schema = z.date();
          break;
        case 'textarea':
          schema = z.string();
          break;
        case 'select':
        case 'radio':
          schema = z.string();
          break;
        case 'group':
          // For group fields, create a nested schema
          if (field.fields) {
            const groupSchema: Record<string, z.ZodTypeAny> = {};
            field.fields.forEach((nestedField) => {
              groupSchema[nestedField.id] = buildFieldSchema(nestedField);
              if (nestedField.required) {
                if (nestedField.type === 'text' || nestedField.type === 'textarea') {
                  groupSchema[nestedField.id] = (groupSchema[nestedField.id] as z.ZodString).min(1, `${nestedField.label} is required`);
                }
              }
            });
            schema = z.object(groupSchema);
          } else {
            schema = z.object({});
          }
          break;
        default:
          schema = z.string();
      }

      // Make field optional if not required
      if (!field.required && field.type !== 'group') {
        schema = schema.optional();
      }

      return schema;
    };

    const schemaObj: Record<string, z.ZodTypeAny> = {};

    // Process all fields from all sections
    formStructure.sections.forEach((section) => {
      section.fields.forEach((field) => {
        schemaObj[field.id] = buildFieldSchema(field);
        if (field.required) {
          if (field.type === 'text' || field.type === 'textarea') {
            schemaObj[field.id] = (schemaObj[field.id] as z.ZodString).min(1, `${field.label} is required`);
          }
        }
      });
    });

    setDynamicSchema(z.object(schemaObj));
  }, [formStructure]);

  // Check if a field should be visible based on its conditions
  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditions || field.conditions.length === 0) {
      return true;
    }

    return field.conditions.every((condition) => {
      const fieldValue = getNestedValue(formValues, condition.field);
      return evaluateCondition(fieldValue, condition);
    });
  };

  // Helper to get nested values from form data
  const getNestedValue = (data: any, path: string): any => {
    const parts = path.split('.');
    let value = data;
    
    for (const part of parts) {
      if (value === undefined || value === null) {
        return undefined;
      }
      value = value[part];
    }
    
    return value;
  };

  // Evaluate a single condition
  const evaluateCondition = (fieldValue: any, condition: FieldCondition): boolean => {
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'notEquals':
        return fieldValue !== condition.value;
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
      case 'greaterThan':
        return typeof fieldValue === 'number' && fieldValue > Number(condition.value);
      case 'lessThan':
        return typeof fieldValue === 'number' && fieldValue < Number(condition.value);
      default:
        return false;
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!formStructure) return;
    
    try {
      setSubmitting(true);
      await mockApi.submitApplication(formStructure.type, data);
      setSubmitSuccess(true);
      form.reset();
    } catch (err) {
      console.error('Failed to submit form:', err);
      setError('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    formStructure,
    loading,
    error,
    submitting,
    submitSuccess,
    shouldShowField,
    onSubmit: form.handleSubmit(onSubmit),
  };
}; 