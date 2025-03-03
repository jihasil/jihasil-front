export class AuthenticationException extends Error {
  readonly name = "AuthenticationException" as const;
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}
