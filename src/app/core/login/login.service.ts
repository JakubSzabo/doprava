import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/modules/user';
import { Login } from '../../shared/modules/login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly apiUrl = environment.apiUrl;
  protected readonly loginUrl = `${this.apiUrl}/api/v1/login`;

  constructor(private http: HttpClient) {}

  try(): Observable<boolean> {
    return this.http.get<boolean>(this.loginUrl).pipe();
  }

  login(body: User): Observable<Login> {
    return this.http.post<Login>(this.loginUrl, body).pipe();
  }
}
