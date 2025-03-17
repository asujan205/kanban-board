"use client";
import { useFormContext } from "react-hook-form";
import { Input } from "~/ui/components/input";

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
}

export const InputField = ({
  name,
  label,
  type = "text",
  placeholder,
  className,
}: InputProps) => {
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
      <Input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`input input-bordered w-full ${error ? "input-error" : ""} ${className}`}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-destructive">{error}</span>
        </label>
      )}
    </div>
  );
};
