export interface UserUpdateDto {
  fullName?: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  dob?: Date;
  identifyCode?: string;
  role?: 'customer' | 'admin' | 'employee';
}
