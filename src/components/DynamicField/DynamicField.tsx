import { useState, useEffect } from 'react';
import { FormField, FieldOption } from '../../types/form';
import { UseFormReturn } from 'react-hook-form';
import { mockApi } from '../../api/mockApi';
import { 
  FormControl, 
  FormField as ShadcnFormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '../ui/form';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DynamicFieldProps {
  field: FormField;
  form: UseFormReturn<any>;
  shouldShow: boolean;
  path?: string;
}

export const DynamicField = ({ field, form, shouldShow, path = '' }: DynamicFieldProps) => {
  const [dynamicOptions, setDynamicOptions] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fieldName = path ? `${path}.${field.id}` : field.id;

  // Fetch dynamic options if needed
  useEffect(() => {
    if (field.optionsUrl && shouldShow) {
      const fetchOptions = async () => {
        try {
          setLoading(true);
          const options = await mockApi.getFieldOptions(field.optionsUrl!);
          setDynamicOptions(options);
        } catch (error) {
          console.error('Failed to fetch options:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchOptions();
    }
  }, [field.optionsUrl, shouldShow]);

  if (!shouldShow) {
    return null;
  }

  // Render different field types
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <ShadcnFormField
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={field.placeholder} 
                    {...formField} 
                    value={formField.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'number':
        return (
          <ShadcnFormField
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder={field.placeholder} 
                    {...formField} 
                    onChange={(e) => {
                      const value = e.target.value === '' ? '' : Number(e.target.value);
                      formField.onChange(value);
                    }}
                    value={formField.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <ShadcnFormField
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={field.placeholder} 
                    {...formField} 
                    value={formField.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'checkbox':
        return (
          <ShadcnFormField
            control={form.control}
            name={fieldName}
            render={() => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <div className="space-y-2">
                  {(field.options || []).map((option) => (
                    <ShadcnFormField
                      key={option.value}
                      control={form.control}
                      name={fieldName}
                      render={({ field: formField }) => {
                        return (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={formField.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  const currentValue = formField.value || [];
                                  const newValue = checked
                                    ? [...currentValue, option.value]
                                    : currentValue.filter((value: string) => value !== option.value);
                                  formField.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'radio':
        return (
          <ShadcnFormField
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    value={formField.value}
                    className="flex flex-col space-y-1"
                  >
                    {(field.options || []).map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        const options = field.optionsUrl ? dynamicOptions : field.options || [];
        
        return (
          <ShadcnFormField
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  value={formField.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || 'Select an option'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'date':
        return (
          <ShadcnFormField
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{field.label}{field.required ? ' *' : ''}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formField.value && "text-muted-foreground"
                        )}
                      >
                        {formField.value ? (
                          format(formField.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formField.value}
                      onSelect={formField.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'group':
        return (
          <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-medium text-lg">{field.label}</h3>
            <div className="space-y-4">
              {field.fields?.map((nestedField) => (
                <DynamicField
                  key={nestedField.id}
                  field={nestedField}
                  form={form}
                  shouldShow={true}
                  path={fieldName}
                />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderField();
}; 