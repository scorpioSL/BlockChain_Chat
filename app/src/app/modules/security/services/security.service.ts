import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignupModel } from '../models/signup-model';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class SecurityService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Register new user
   *
   * Expects a SignUp model object
   *
   * Returns Success or error
   * Success -> {type:success,obj:saved object}
   * Error -> {type:error:error:'error string'}
   */
  public RegisterUser(model: SignupModel): Observable<any> {
    return this.http.post(
      `${environment.baseEndPoint}/auth/save`,
      model,
      this.httpOptions
    );
  }

  public login(model: Login): Observable<any> {
    return this.http.post(
      `${environment.baseEndPoint}/auth/login`,
      model,
      this.httpOptions
    );
  }
}
