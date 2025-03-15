"use client";
import { useFormContext } from "react-hook-form";
import { Textarea } from "~/ui/components/text-area";

interface TextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const TextareaField = ({
  name,
  label,
  placeholder,
  className,
  rows = 4,
}: TextareaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <Textarea
        {...register(name)}
        placeholder={placeholder}
        rows={rows}
        className={`textarea textarea-bordered min-h-[80px] w-full ${
          error ? "textarea-error" : ""
        } ${className}`}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};
