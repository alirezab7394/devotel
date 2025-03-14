"use client";

import { useState, useEffect } from "react";
import { 
  DynamicFormField, 
  DynamicFormValues,
  DynamicGroupField,
  DynamicSelectField,
  DynamicDateField
} from "@/types/form";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { isFieldVisible, fetchDynamicOptions } from "@/lib/dynamic-form-utils";
import { useFormContext } from "react-hook-form";

interface DynamicFieldProps {
  field: DynamicFormField;
  formValues: DynamicFormValues;
  disabled?: boolean;
}

export function DynamicField({ field, formValues, disabled = false }: DynamicFieldProps) {
  const form = useFormContext();
  const [dynamicOptions, setDynamicOptions] = useState<string[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const isVisible = isFieldVisible(field, formValues);

  useEffect(() => {
    if (field.type === 'select' && (field as DynamicSelectField).dynamicOptions) {
      const loadOptions = async () => {
        setIsLoadingOptions(true);
        try {
          const options = await fetchDynamicOptions(field, formValues);          
          setDynamicOptions(options);
        } catch (error) {
          console.error('Error loading dynamic options:', error);
          setDynamicOptions([]);
        } finally {
          setIsLoadingOptions(false);
        }
      };
      
      // Only fetch options if the dependent field has a value
      const selectField = field as DynamicSelectField;
      if (selectField.dynamicOptions && formValues[selectField.dynamicOptions.dependsOn]) {
        loadOptions();
      } else {
        setDynamicOptions([]);
      }
    }
  }, [field, formValues]);

  if (!isVisible) {
    return null;
  }

  if (field.type === 'group') {
    const groupField = field as DynamicGroupField;
    return (
      <div className="space-y-4 border p-4 rounded-md">
        <h3 className="text-lg font-medium">{field.label}</h3>
        <div className="space-y-4">
          {groupField.fields.map((nestedField) => (
            <DynamicField 
              key={nestedField.id} 
              field={nestedField} 
              formValues={formValues}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={field.id}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>{field.label}{field.required && <span className="text-red-500">*</span>}</FormLabel>
          <FormControl>
            {renderFieldInput(field, formField, dynamicOptions, isLoadingOptions, disabled)}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function renderFieldInput(
  field: DynamicFormField, 
  formField: any, 
  dynamicOptions: string[] = [],
  isLoadingOptions: boolean = false,
  disabled: boolean = false
) {
  switch (field.type) {
    case 'text':
      return (
        <Input 
          {...formField} 
          type="text"
          disabled={disabled}
        />
      );
      
    case 'number':
      return (
        <Input 
          {...formField} 
          type="number" 
          min={field.validation?.min} 
          max={field.validation?.max}
          disabled={disabled}
        />
      );
      
    case 'date':
      const dateField = field as DynamicDateField;
      return (
        <DatePicker
          date={formField.value ? new Date(formField.value) : undefined}
          setDate={(date) => {
            // Format the date as YYYY-MM-DD for form submission
            formField.onChange(date ? date.toISOString().split('T')[0] : '');
          }}
          disabled={disabled}
          placeholder={dateField.label || "Select date"}
        />
      );
      
    case 'select':
      const selectField = field as DynamicSelectField;
      const options = selectField.dynamicOptions ? dynamicOptions : selectField.options || [];
      
      return (
        <Select 
          onValueChange={formField.onChange} 
          defaultValue={formField.value}
          disabled={disabled || isLoadingOptions}
        >
          <SelectTrigger>
            <SelectValue placeholder={isLoadingOptions ? "Loading options..." : "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
      
    case 'radio':
      return (
        <RadioGroup 
          onValueChange={formField.onChange} 
          defaultValue={formField.value}
          className="flex flex-col space-y-1"
          disabled={disabled}
        >
          {field.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${field.id}-${option}`} disabled={disabled} />
              <label htmlFor={`${field.id}-${option}`} className={disabled ? "opacity-70" : ""}>
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>
      );
      
    case 'checkbox':
      return (
        <div className="flex flex-col space-y-2">
          {field.options?.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox 
                id={`${field.id}-${option}`} 
                onCheckedChange={(checked) => {
                  if (disabled) return;
                  const currentValue = formField.value || [];
                  const newValue = checked 
                    ? [...currentValue, option]
                    : currentValue.filter((val: string) => val !== option);
                  formField.onChange(newValue);
                }}
                checked={(formField.value || []).includes(option)}
                disabled={disabled}
              />
              <label 
                htmlFor={`${field.id}-${option}`}
                className={disabled ? "opacity-70" : ""}
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      );
      
    default:
      return <div>Unsupported field type: {field.type}</div>;
  }
} 