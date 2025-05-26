export class LoginResponseRoles {
  public id?: number;

  public name?: string;

  public description?: string;

  public disabled?: boolean;
}

export class LoginResponse {
  public username?: string;

  public roles?: LoginResponseRoles[];

  public token?: string;
}
