import React, { useState, useEffect } from "react";
import FormField from "./FormField";
import ProgressBar from "./ProgressBar";
import { fetchFormStructure } from "@/app/utils/api";
import { FormField as FieldType, FormStructure } from "@/app/types/form";

interface SubmittedData {
  [key: string]: any;
}

const DynamicForm: React.FC = () => {
  const [formType, setFormType] = useState<string>("User Information");
  const [fields, setFields] = useState<FieldType[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submittedData, setSubmittedData] = useState<{
    [key: string]: SubmittedData[];
  }>({
    "User Information": [],
    "Address Information": [],
    "Payment Information": [],
  });
  const [progress, setProgress] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    fetchFormStructure(formType).then((response: FormStructure) => {
      setFields(response.fields);
      setFormData({});
      setFeedback("");
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
    setSubmittedData((prev) => ({
      ...prev,
      [formType]: [...prev[formType], formData],
    }));
    setFormData({});
    setFeedback("Form Submitted Successfully!");
  };

  const handleDelete = (index: number) => {
    setSubmittedData((prev) => ({
      ...prev,
      [formType]: prev[formType].filter((_, i) => i !== index),
    }));
    setFeedback("Entry deleted successfully.");
  };

  const handleEdit = (index: number) => {
    setFormData(submittedData[formType][index]);
    setSubmittedData((prev) => ({
      ...prev,
      [formType]: prev[formType].filter((_, i) => i !== index),
    }));
    setFeedback("Edit mode activated. Make changes and resubmit.");
  };

  const handleFileUpload = (name: string, file: File) => {
    setFormData((prev) => ({ ...prev, [name]: file.name }));
    setFeedback("File uploaded successfully!");
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

      {feedback && (
        <div className="my-4 p-2 bg-green-100 text-green-700 rounded-md">
          {feedback}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name] || ""}
            onChange={handleFieldChange}
            onFileUpload={handleFileUpload}
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

      {Object.keys(submittedData).map((type) => {
        if (type === formType && submittedData[type].length > 0) {
          return (
            <div key={type} className="mt-8">
              <h2 className="text-lg font-semibold mb-4">
                {type} Submitted Data
              </h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    {Object.keys(submittedData[type][0]).map((key) => (
                      <th key={key} className="border border-gray-300 p-2">
                        {key}
                      </th>
                    ))}
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedData[type].map((data, index) => (
                    <tr key={index}>
                      {Object.values(data).map((value, idx) => (
                        <td key={idx} className="border border-gray-300 p-2">
                          {value}
                        </td>
                      ))}
                      <td className="border border-gray-300 p-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-blue-500 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default DynamicForm;
