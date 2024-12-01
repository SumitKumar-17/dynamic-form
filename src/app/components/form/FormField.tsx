import React from "react";
import { FormField as FieldType } from "@/app/types/form";

interface FormFieldProps {
  field: FieldType;
  value: string|number|readonly string[];
  onChange: (name: string, value: string|number|readonly string[]) => void;
  onFileUpload?: (name: string, file: File) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  onFileUpload,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    onChange(field.name, e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(field.name, file);
    }
  };

  return (
    <div>
      <label className="block text-gray-700">{field.label}</label>
      {field.type === "dropdown" ? (
        <select
          value={value}
          onChange={handleChange}
          className="p-2 border rounded-md w-full"
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "file" ? (
        <input
          type="file"
          onChange={handleFileChange}
          className="p-2 border rounded-md w-full"
        />
      ) : (
        <input
          type={field.type}
          value={value}
          onChange={handleChange}
          className="p-2 border rounded-md w-full"
          required={field.required}
        />
      )}
      {field.required && !value && (
        <span className="text-red-500 text-sm">This field is required</span>
      )}
    </div>
  );
};

export default FormField;
