export type User = {
  id: string;
  name: string;
  password: string;
  role: string;
};

export type UserKey = {
  id: string;
};

export type UserResponseDTO = {
  id: string;
  name: string;
  role: string;
};

export type UserEditRequestDTO = {
  id: string;
  [key: string]: string | number | boolean;
};

export type UserSignUpRequestDTO = {
  id: string;
  name: string;
  password: string;
  role?: string;
};
