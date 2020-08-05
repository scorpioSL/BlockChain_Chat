import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChathttpService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  public getUsers(): Observable<any> {
    return this.http.get(
      `${environment.baseEndPoint}/contact/users`,
      this.httpOptions
    );
  }

  public addToContact(model): Observable<any> {
    return this.http.post(
      `${environment.baseEndPoint}/contact/add`,
      model,
      this.httpOptions
    );
  }

  public getContactList(model): Observable<any> {
    return this.http.post(
      `${environment.baseEndPoint}/contact/getContactList`,
      model,
      this.httpOptions
    );
  }
}
