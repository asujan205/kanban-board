"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProps } from "../types/form.types";
import { useEffect } from "react";

const useFormBuilder = <SchemaType extends z.ZodObject<any, any>>({
  schema,
  onSubmitProps,
  fieldConfig,
  initValues,
  onValuesChange,
  onParsedValuesChange,
  values,
  ...props
}: FormProps<SchemaType>) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initValues,
    values,
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const parsedValues = schema.safeParse(values);
    if (parsedValues.success) {
      await onSubmitProps?.(parsedValues.data, form);
    }
  }

  useEffect(() => {
    const subscription = form.watch((values) => {
      onValuesChange?.(values, form);
      const parsedValues = schema.safeParse(values);
      if (parsedValues.success) {
        onParsedValuesChange?.(parsedValues.data, form);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, schema, onValuesChange, onParsedValuesChange]);

  return {
    form,
    onSubmit,
  };
};

export default useFormBuilder;
