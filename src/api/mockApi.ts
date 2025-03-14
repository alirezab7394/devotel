import { FormStructure, Application, FieldOption } from '../types/form';

// Mock data for insurance form structures
const formStructures: FormStructure[] = [
  {
    id: 'health-insurance',
    title: 'Health Insurance Application',
    type: 'health',
    sections: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            required: true,
          },
          {
            id: 'age',
            type: 'number',
            label: 'Age',
            required: true,
            validation: {
              min: 18,
              max: 100,
              message: 'Age must be between 18 and 100',
            },
          },
          {
            id: 'gender',
            type: 'radio',
            label: 'Gender',
            required: true,
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
            ],
          },
          {
            id: 'pregnancy',
            type: 'radio',
            label: 'Are you currently pregnant?',
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
            conditions: [
              {
                field: 'gender',
                operator: 'equals',
                value: 'female',
              },
            ],
          },
        ],
      },
      {
        id: 'medical-history',
        title: 'Medical History',
        fields: [
          {
            id: 'existing-conditions',
            type: 'checkbox',
            label: 'Do you have any existing medical conditions?',
            options: [
              { label: 'Diabetes', value: 'diabetes' },
              { label: 'Heart Disease', value: 'heart-disease' },
              { label: 'Asthma', value: 'asthma' },
              { label: 'Cancer', value: 'cancer' },
              { label: 'None', value: 'none' },
            ],
          },
          {
            id: 'medication',
            type: 'textarea',
            label: 'List any medications you are currently taking',
            conditions: [
              {
                field: 'existing-conditions',
                operator: 'notEquals',
                value: 'none',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'car-insurance',
    title: 'Car Insurance Application',
    type: 'car',
    sections: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            required: true,
          },
          {
            id: 'age',
            type: 'number',
            label: 'Age',
            required: true,
            validation: {
              min: 18,
              max: 100,
              message: 'Age must be between 18 and 100',
            },
          },
        ],
      },
      {
        id: 'vehicle-info',
        title: 'Vehicle Information',
        fields: [
          {
            id: 'vehicle',
            type: 'group',
            label: 'Vehicle Details',
            fields: [
              {
                id: 'make',
                type: 'text',
                label: 'Make',
                required: true,
              },
              {
                id: 'model',
                type: 'text',
                label: 'Model',
                required: true,
              },
              {
                id: 'year',
                type: 'number',
                label: 'Year',
                required: true,
                validation: {
                  min: 1950,
                  max: new Date().getFullYear(),
                  message: `Year must be between 1950 and ${new Date().getFullYear()}`,
                },
              },
            ],
          },
          {
            id: 'had-accidents',
            type: 'radio',
            label: 'Have you had any accidents in the last 5 years?',
            required: true,
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
          {
            id: 'num-accidents',
            type: 'number',
            label: 'Number of Accidents',
            required: true,
            validation: {
              min: 1,
              message: 'Please enter the number of accidents',
            },
            conditions: [
              {
                field: 'had-accidents',
                operator: 'equals',
                value: 'yes',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'home-insurance',
    title: 'Home Insurance Application',
    type: 'home',
    sections: [
      {
        id: 'personal-info',
        title: 'Personal Information',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            required: true,
          },
          {
            id: 'age',
            type: 'number',
            label: 'Age',
            required: true,
            validation: {
              min: 18,
              max: 100,
              message: 'Age must be between 18 and 100',
            },
          },
        ],
      },
      {
        id: 'property-info',
        title: 'Property Information',
        fields: [
          {
            id: 'address',
            type: 'group',
            label: 'Property Address',
            fields: [
              {
                id: 'street',
                type: 'text',
                label: 'Street Address',
                required: true,
              },
              {
                id: 'city',
                type: 'text',
                label: 'City',
                required: true,
              },
              {
                id: 'state',
                type: 'select',
                label: 'State',
                required: true,
                optionsUrl: 'states',
              },
              {
                id: 'zip',
                type: 'text',
                label: 'ZIP Code',
                required: true,
                validation: {
                  pattern: '^\\d{5}(-\\d{4})?$',
                  message: 'Please enter a valid ZIP code',
                },
              },
            ],
          },
          {
            id: 'has-security',
            type: 'radio',
            label: 'Do you have a security system?',
            required: true,
            options: [
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
            ],
          },
          {
            id: 'security-type',
            type: 'select',
            label: 'Security System Type',
            required: true,
            options: [
              { label: 'Basic Alarm', value: 'basic' },
              { label: 'Monitored System', value: 'monitored' },
              { label: 'Smart Home Security', value: 'smart' },
              { label: 'Guard Service', value: 'guard' },
            ],
            conditions: [
              {
                field: 'has-security',
                operator: 'equals',
                value: 'yes',
              },
            ],
          },
        ],
      },
    ],
  },
];

// Mock applications data
let applications: Application[] = [];

// Mock API service
export const mockApi = {
  // Get all form structures
  getFormStructures: async (): Promise<FormStructure[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(formStructures);
      }, 500);
    });
  },

  // Get a specific form structure by ID
  getFormStructure: async (id: string): Promise<FormStructure | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const form = formStructures.find((f) => f.id === id);
        resolve(form);
      }, 500);
    });
  },

  // Get dynamic options for a field (e.g., states based on country)
  getFieldOptions: async (optionsUrl: string): Promise<FieldOption[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        switch (optionsUrl) {
          case 'states':
            resolve([
              { label: 'Alabama', value: 'AL' },
              { label: 'Alaska', value: 'AK' },
              { label: 'Arizona', value: 'AZ' },
              { label: 'Arkansas', value: 'AR' },
              { label: 'California', value: 'CA' },
              { label: 'Colorado', value: 'CO' },
              { label: 'Connecticut', value: 'CT' },
              // Add more states as needed
            ]);
            break;
          default:
            resolve([]);
        }
      }, 300);
    });
  },

  // Submit an application
  submitApplication: async (formType: string, data: any): Promise<Application> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newApplication: Application = {
          id: `app-${Date.now()}`,
          userId: 'user-123', // In a real app, this would come from auth
          formType,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          data,
        };
        
        applications.push(newApplication);
        resolve(newApplication);
      }, 700);
    });
  },

  // Get all applications
  getApplications: async (): Promise<Application[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...applications]);
      }, 500);
    });
  },
}; 