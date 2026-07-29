export class AuthRoutes {
  public static get GET_CURRENT_USER() {
    return '/api/user/@me';
  }

  public static get REGISTER_USER() {
    return '/api/user/register';
  }

  public static get LOGIN_USER() {
    return '/api/user/login';
  }

  public static get LOGOUT_USER() {
    return '/api/user/logout';
  }
}
