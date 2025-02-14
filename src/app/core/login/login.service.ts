import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/modules/user';
import { Login } from '../../shared/modules/login';
import { LOGIN_API } from '../../shared/api/api';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  try(): Observable<boolean> {
    return this.http.get<boolean>(LOGIN_API + '/try').pipe();
  }

  login(body: User): Observable<Login> {
    return this.http.post<Login>(LOGIN_API, body).pipe();
  }
}
