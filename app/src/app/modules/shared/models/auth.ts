import { AES, enc } from 'crypto-js';
import { environment } from 'src/environments/environment';

export class Auth {
  constructor() {}

  public static setEmail(email) {
    localStorage.setItem(
      'a_u_e',
      AES.encrypt(email, environment.crypt).toString()
    );
  }

  public static getEmail() {
    return AES.decrypt(
      localStorage.getItem('a_u_e'),
      environment.crypt
    ).toString(enc.Utf8);
  }

  public static getUserId() {
    return localStorage.getItem('a_u_id');
  }

  public static setUserId(id) {
    localStorage.setItem('a_u_id', id);
  }

  public static emptyAuth() {
    localStorage.clear();
  }
}
