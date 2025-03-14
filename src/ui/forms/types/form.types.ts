import * as z from "zod";
import {
  ControllerRenderProps,
  DefaultValues,
  FieldValues,
  FormState,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  [key: string]: any;
};

export type FieldConfigItem = {
  inputProps?: ((form: UseFormReturn<any>) => InputProps) | InputProps;
  onChange?: (value: any, form: ReturnType<typeof useForm>) => void;
  fieldType: "input" | "textarea";
};

export type FieldConfig<SchemaType extends z.infer<z.ZodObject<any, any>>> = {
  [key in keyof SchemaType]: FieldConfigItem;
};
export type FormProps<SchemaType extends z.ZodObject<any, any>> = {
  schema: SchemaType;
  onSubmit: (data: z.infer<SchemaType>) => void;
  fieldConfig?: FieldConfig<z.infer<SchemaType>>;
  initValues?: DefaultValues<z.infer<SchemaType>>;

  children: (form: UseFormReturn<FieldValues, any>) => React.ReactNode;
  formState?: FormState<z.infer<SchemaType>>;
};
