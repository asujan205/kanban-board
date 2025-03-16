"use client";
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
          e.preventDefault();
          void form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        {Object.keys(schema?.shape).map((key) => {
          const fieldType: keyof typeof INPUT_COMPONENTS =
            fieldConfig?.[key]?.fieldType ?? "input";
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

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="hover:bg-primary-dark rounded-md bg-primary px-4 py-2 text-white"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Form>
  );
};
