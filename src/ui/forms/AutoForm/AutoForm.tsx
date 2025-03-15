
'use client'
import * as z from "zod";
import { FormProps } from "../types/form.types";
import { FormProvider } from "react-hook-form";
import useFormBuilder from "../hooks/useFormBuilder";
import { INPUT_COMPONENTS } from "../config";
const Form = FormProvider;
export const AutoForm = <SchemaType extends z.ZodObject<any, any>>({
  schema,
  values,
  onParsedValuesChange,
  onValuesChange,
  onSubmitProps,
  fieldConfig,
  initValues,
}: FormProps<SchemaType>) => {
  const { form, onSubmit } = useFormBuilder({
    schema,
    onSubmitProps,
    fieldConfig,
    values,
    onValuesChange,
    onParsedValuesChange,
    initValues,
  });
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        {Object.keys(schema?.shape).map((key) => {
          const fieldType: keyof typeof INPUT_COMPONENTS =
            fieldConfig?.[key]?.fieldType || "input";
          const inputProps = fieldConfig?.[key]?.inputProps;
          const InputComponent = INPUT_COMPONENTS[fieldType];

          if (InputComponent) {
            return (
              <div key={key} className="form-field">
                <InputComponent
                  name={key}
                  {...(inputProps
                    ? typeof inputProps === "function"
                      ? inputProps(form)
                      : inputProps
                    : {})}
                />
              </div>
            );
          }
          return null;
        })}
        
        <div className="flex justify-end gap-2 mt-4">
          <button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </Form>
  );
};
