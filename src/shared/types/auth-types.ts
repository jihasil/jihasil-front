type User = {
  id: string;
  name: string;
  role?: string;
};

export type Session = {
  user: User | null;
};
