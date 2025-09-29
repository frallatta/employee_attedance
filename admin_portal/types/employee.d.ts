export interface Employee {
  id: number;
  email: string;
  phone_number: string;
  full_name: string;
  job_position: string;
  image_file_url: string;
  is_admin: boolean;
  is_active: boolean;
}

export interface FormEmployee {
  email?: string;
  password?: string;
  phone_number?: string;
  full_name?: string;
  job_position?: string;
  image_file_url?: string;
  is_admin?: boolean;
  is_active?: boolean;
}

export interface FormErrorEmployee {
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

export interface Attendance {
  id: number;
  employee: Employee;
  attendance_date: string;
  attendance_in: Date;
  attendance_out: Date;
}
