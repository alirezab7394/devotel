import { describe, it, expect } from 'vitest';
import { isFieldVisible } from './dynamic-form-utils';
import { DynamicFormField } from '@/types/form';

describe('isFieldVisible', () => {
    it('returns true when field has no visibility condition', () => {
        const field = { id: 'test', type: 'text', label: 'Test' } as DynamicFormField;
        const formValues = {};

        expect(isFieldVisible(field, formValues)).toBe(true);
    });

    it('returns false when dependent field value is undefined', () => {
        const field = {
            id: 'test',
            type: 'text',
            label: 'Test',
            visibility: {
                dependsOn: 'otherField',
                condition: 'equals',
                value: 'yes'
            }
        } as DynamicFormField;

        const formValues = {};

        expect(isFieldVisible(field, formValues)).toBe(false);
    });

    it('returns true when condition is equals and values match', () => {
        const field = {
            id: 'test',
            type: 'text',
            label: 'Test',
            visibility: {
                dependsOn: 'otherField',
                condition: 'equals',
                value: 'yes'
            }
        } as DynamicFormField;

        const formValues = { otherField: 'yes' };

        expect(isFieldVisible(field, formValues)).toBe(true);
    });

    it('returns false when condition is equals and values do not match', () => {
        const field = {
            id: 'test',
            type: 'text',
            label: 'Test',
            visibility: {
                dependsOn: 'otherField',
                condition: 'equals',
                value: 'yes'
            }
        } as DynamicFormField;

        const formValues = { otherField: 'no' };

        expect(isFieldVisible(field, formValues)).toBe(false);
    });

    it('returns true when condition is notEquals and values do not match', () => {
        const field = {
            id: 'test',
            type: 'text',
            label: 'Test',
            visibility: {
                dependsOn: 'otherField',
                condition: 'notEquals',
                value: 'yes'
            }
        } as DynamicFormField;

        const formValues = { otherField: 'no' };

        expect(isFieldVisible(field, formValues)).toBe(true);
    });

    it('returns true when condition is contains and array includes the value', () => {
        const field = {
            id: 'test',
            type: 'text',
            label: 'Test',
            visibility: {
                dependsOn: 'otherField',
                condition: 'contains',
                value: 'option2'
            }
        } as DynamicFormField;

        const formValues = { otherField: ['option1', 'option2', 'option3'] };

        expect(isFieldVisible(field, formValues)).toBe(true);
    });

    it('returns true when condition is contains and string includes the value', () => {
        const field = {
            id: 'test',
            type: 'text',
            label: 'Test',
            visibility: {
                dependsOn: 'otherField',
                condition: 'contains',
                value: 'world'
            }
        } as DynamicFormField;

        const formValues = { otherField: 'hello world' };

        expect(isFieldVisible(field, formValues)).toBe(true);
    });
}); 