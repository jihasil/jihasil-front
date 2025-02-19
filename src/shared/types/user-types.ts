export type User = {
  id: string;
  name: string;
  password: string;
  role: string;
  refreshToken?: string;
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
  role?: string;
  name?: string;
  password?: string;
  refreshToken?: string;
};

export type UserSignInRequestDTO = {
  id: string;
  password: string;
  redirectTo?: string;
};

export type UserSignUpRequestDTO = {
  id: string;
  name: string;
  password: string;
  role?: string;
};

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
  accessTokenAge: number;
  refreshTokenAge: number;
};
