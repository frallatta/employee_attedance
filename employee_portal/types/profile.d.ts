export interface Profile {
  id: number;
  email: string;
  phone_number: string;
  full_name: string;
  job_position: string;
  image_file_url: string;
  is_admin: boolean;
  is_active: boolean;
}

export interface FormProfile {
  email?: string;
  password?: string;
  phone_number?: string;
  full_name?: string;
  job_position?: string;
  image_file_url?: string;
  is_admin?: boolean;
  is_active?: boolean;
}

export interface FormErrorProfile {
  email?: string[];
  password?: string[];
  phone_number?: string[];
  full_name?: string[];
  job_position?: string[];
  image_file_url?: string[];
  is_admin?: string[];
  is_active?: string[];
  message?: string[];
}

export interface FormChangePassword {
  current_password?: string;
  new_password?: string;
}

export interface FormErrorChangePassword {
  current_password?: string[];
  new_password?: string[];
}
