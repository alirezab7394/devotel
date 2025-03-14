import {
  DynamicFormConfig,
  DynamicFormField,
  DynamicFormValues,
  DynamicGroupField,
  DynamicSelectField
} from "@/types/form";
import { fetchData } from "@/services/apiService";

/**
 * Checks if a field should be visible based on its visibility condition
 */
export function isFieldVisible(
  field: DynamicFormField,
  formValues: DynamicFormValues
): boolean {
  if (!field.visibility) {
    return true;
  }

  const { dependsOn, condition, value } = field.visibility;
  const dependentValue = formValues[dependsOn];

  if (dependentValue === undefined) {
    return false;
  }

  switch (condition) {
    case 'equals':
      return dependentValue === value;
    case 'notEquals':
      return dependentValue !== value;
    case 'contains':
      return Array.isArray(dependentValue)
        ? dependentValue.includes(value)
        : String(dependentValue).includes(value);
    default:
      return true;
  }
}

/**
 * Fetches dynamic options for a select field
 */
export async function fetchDynamicOptions(
  field: DynamicFormField,
  formValues: DynamicFormValues
): Promise<string[]> {
  if (field.type !== 'select') {
    return [];
  }

  const selectField = field as DynamicSelectField;
  const dynamicOptions = selectField.dynamicOptions;

  // Check if dynamicOptions exists
  if (!dynamicOptions) {
    return [];
  }

  const dependsOn = dynamicOptions.dependsOn;
  const endpoint = dynamicOptions.endpoint;
  const method = dynamicOptions.method || 'GET'; // Default to GET if method is not specified

  const dependentValue = formValues[dependsOn];

  if (!dependentValue) {
    return [];
  }

  try {
    // Use the API service to fetch dynamic options
    let url = endpoint;

    // For GET requests, append the dependent value as a query parameter
    if (method === "GET") {
      // Check if the URL already has query parameters
      const separator = url.includes('?') ? '&' : '?';
      url = `${url}${separator}${dependsOn}=${encodeURIComponent(dependentValue)}`;
      const data = await fetchData<{ states: string[] }>(url);

      return data.states;
    }

    return [];
  } catch (error) {
    console.error('Error fetching dynamic options:', error);
    return [];
  }
}

/**
 * Validates a field value based on its validation rules
 */
export function validateField(
  field: DynamicFormField,
  value: any
): string | null {
  if (!field.validation) {
    return null;
  }

  const { min, max, pattern } = field.validation;

  if (value === undefined || value === null || value === '') {
    return field.required ? `${field.label} is required` : null;
  }

  if (field.type === 'number') {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      return `${field.label} must be a valid number`;
    }

    if (min !== undefined && numValue < min) {
      return `${field.label} must be at least ${min}`;
    }

    if (max !== undefined && numValue > max) {
      return `${field.label} must be at most ${max}`;
    }
  }

  if (field.type === 'text' && pattern) {
    const regex = new RegExp(pattern);
    if (!regex.test(String(value))) {
      return `${field.label} has an invalid format`;
    }
  }

  return null;
}

/**
 * Flattens nested form fields for easier processing
 */
export function flattenFormFields(
  fields: DynamicFormField[],
  prefix: string = ''
): DynamicFormField[] {
  return fields.flatMap(field => {
    if (field.type === 'group') {
      const groupField = field as DynamicGroupField;
      return flattenFormFields(groupField.fields, `${prefix}${field.id}.`);
    }

    // Create a copy of the field with a prefixed ID
    const newField = { ...field };
    if (prefix) {
      newField.id = `${prefix}${field.id}`;
    }

    return [newField];
  });
}

/**
 * Finds a form configuration by its ID
 */
export function findFormById(
  forms: DynamicFormConfig[],
  formId: string
): DynamicFormConfig | undefined {
  return forms.find(form => form.formId === formId);
}

/**
 * Extracts initial values from form fields
 */
export function getInitialValues(fields: DynamicFormField[]): DynamicFormValues {
  const initialValues: DynamicFormValues = {};

  const processFields = (fields: DynamicFormField[], prefix: string = '') => {
    fields.forEach(field => {
      if (field.type === 'group') {
        const groupField = field as DynamicGroupField;
        processFields(groupField.fields, `${prefix}${field.id}.`);
      } else {
        initialValues[`${prefix}${field.id}`] = '';
      }
    });
  };

  processFields(fields);
  return initialValues;
} 