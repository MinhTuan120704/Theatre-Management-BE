export interface UserResponseDto {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  dob: Date;
  cccd: string;
  role: 'customer' | 'admin' | 'employee';
  created_at: Date;
}
