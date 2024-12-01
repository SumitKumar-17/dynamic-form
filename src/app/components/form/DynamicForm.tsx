import React, { useState, useEffect } from "react";
import FormField from "./FormField";
import ProgressBar from "./ProgressBar";
import { fetchFormStructure } from "@/app/utils/api";
import { FormField as FieldType, FormStructure } from "@/app/types/form";

const DynamicForm: React.FC = () => {
  const [formType, setFormType] = useState<string>("User Information");
  const [fields, setFields] = useState<FieldType[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    fetchFormStructure(formType).then((response: FormStructure) => {
      setFields(response.fields);
      setFormData({});
    });
  }, [formType]);

  useEffect(() => {
    const requiredFields = fields.filter((field) => field.required);
    const filledFields = requiredFields.filter((field) => formData[field.name]);
    setProgress((filledFields.length / requiredFields.length) * 100 || 0);
  }, [fields, formData]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Sign-up Successful");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <header>
        <h1 className="text-xl font-bold mb-4">Dynamic Form</h1>
        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option>User Information</option>
          <option>Address Information</option>
          <option>Payment Information</option>
        </select>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name] || ""}
            onChange={handleFieldChange}
          />
        ))}
        <ProgressBar progress={progress} />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={progress < 100}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
