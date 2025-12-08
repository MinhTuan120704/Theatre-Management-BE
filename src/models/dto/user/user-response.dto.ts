export interface UserResponseDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  identifyCode: string;
  role: 'customer' | 'admin' | 'employee';
  createdAt: Date;
}
