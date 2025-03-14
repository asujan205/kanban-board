import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormProps } from "../types/form.types";

const useFormBuilder = <SchemaType extends z.ZodObject<any, any>>({
  schema,
  onSubmit,
  fieldConfig,
  initValues,
  ...props
}: FormProps<SchemaType>) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initValues,
  });

  // const handleSubmit
};
