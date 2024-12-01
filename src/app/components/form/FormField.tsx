import React from "react";
import { FormField as FieldType } from "@/types/form";

interface FormFieldProps {
  field: FieldType;
  value: any;
  onChange: (name: string, value: any) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    onChange(field.name, e.target.value);
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
