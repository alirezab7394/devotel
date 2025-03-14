export type FieldType = 
  | 'text'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'textarea'
  | 'group';

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: string | number | boolean;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: FieldOption[];
  optionsUrl?: string; // For dynamically fetching options
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditions?: FieldCondition[]; // Conditions for showing this field
  fields?: FormField[]; // For nested fields (group type)
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormStructure {
  id: string;
  title: string;
  type: string; // e.g., 'health', 'car', 'home', 'life'
  sections: FormSection[];
}

export interface FormData {
  [key: string]: any;
}

export interface Application {
  id: string;
  userId: string;
  formType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  data: FormData;
}

// Dynamic Form System Types
export interface DynamicValidationRule {
  min?: number;
  max?: number;
  pattern?: string;
}

export interface DynamicVisibilityCondition {
  dependsOn: string;
  condition: 'equals' | 'notEquals' | 'contains';
  value: string;
}

export interface DynamicOptionsConfig {
  dependsOn: string;
  endpoint: string;
  method: 'GET' | 'POST';
}

export interface DynamicBaseField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  validation?: DynamicValidationRule;
  visibility?: DynamicVisibilityCondition;
}

export interface DynamicTextField extends DynamicBaseField {
  type: 'text';
}

export interface DynamicNumberField extends DynamicBaseField {
  type: 'number';
  validation?: DynamicValidationRule;
}

export interface DynamicDateField extends DynamicBaseField {
  type: 'date';
}

export interface DynamicSelectField extends DynamicBaseField {
  type: 'select';
  options?: string[];
  dynamicOptions?: DynamicOptionsConfig;
}

export interface DynamicRadioField extends DynamicBaseField {
  type: 'radio';
  options: string[];
}

export interface DynamicCheckboxField extends DynamicBaseField {
  type: 'checkbox';
  options: string[];
}

export interface DynamicGroupField extends DynamicBaseField {
  type: 'group';
  fields: DynamicFormField[];
}

export type DynamicFormField = 
  | DynamicTextField 
  | DynamicNumberField 
  | DynamicDateField 
  | DynamicSelectField 
  | DynamicRadioField 
  | DynamicCheckboxField 
  | DynamicGroupField;

export interface DynamicFormConfig {
  formId: string;
  title: string;
  fields: DynamicFormField[];
}

export type DynamicFormValues = Record<string, any>; 