export interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

export interface FormStructure {
  fields: FormField[];
}
