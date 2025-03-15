'use client'
import { useFormContext } from "react-hook-form";

interface SelectProps {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
  className?: string;
}

export const SelectField = ({
  name,
  label,
  options,
  className,
}: SelectProps) => {
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
      <select
        {...register(name)}
        className={`select select-bordered w-full ${error ? "select-error" : ""} ${className}`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};
