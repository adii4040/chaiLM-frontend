export interface User {
  _id: string;
  fullname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignupRequestDto {
  fullname: string;
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  success: boolean;
  user: User;
  message: string;
}

export interface CurrentUserDto {
  success: boolean;
  user: User;
  message: string;
}
