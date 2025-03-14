import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Textarea } from "~/ui/components/text-area";
import { cn } from "~/utils/cn";

const InputField = React.forwardRef<
  HTMLTextAreaElement,
  React.HTMLAttributes<HTMLTextAreaElement> & {
    as?: "textarea";
    name: string;
  }
>(({ className, as: Component = "input", name, ...props }, ref) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("flex flex-col space-y-1", className)}>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {name}
          </label>
          <Textarea {...field} {...props} ref={ref} />
          {error?.message && (
            <div className="text-destructive text-sm">{error.message}</div>
          )}
        </div>
      )}
    />
  );
});

export { InputField };
