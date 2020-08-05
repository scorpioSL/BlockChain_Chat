import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  protected baseEndPoint = environment.baseEndPoint;
  errorMessage: {
    status: any;
    message: string;
  };
  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor() {}

  //Check if any of object properties have null values or not
  checkEmpty(data: any) {
    let exist = false;
    let properties = [];
    for (var key in data) {
      if (data[key] === '' || data[key] == null) {
        if (!exist) {
          exist = true;
        }
        properties.push(key);
      }
    }
    return properties;
  }

  handleError(error: Response | any) {
    // debugger
    if (error.status === 0) {
      this.errorMessage = {
        message: 'Please check your internet connection',
        status: error.status,
      };
    } else if (error.status === 400) {
      // localStorage.removeItem("TokenId");
      this.errorMessage = {
        message: error.error.message,
        status: error.status,
      };
    } else if (
      error.status === 401 ||
      error.status === 403 ||
      error.status === 404 ||
      error.status === 408
    ) {
      // localStorage.removeItem("TokenId");
      this.errorMessage = {
        message: 'Your login time has been expired, login again',
        status: error.status,
      };
    } else {
      this.errorMessage = {
        message: error.error.message,
        status: error.status,
      };
    }
    const errorMsg = Object.assign({}, this.errorMessage);
    return throwError(errorMsg);
  }
}
