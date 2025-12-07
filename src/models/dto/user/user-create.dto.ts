export interface UserCreateDto {
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  dob: Date;
  cccd: string;
  role: 'customer' | 'admin' | 'employee';
}
