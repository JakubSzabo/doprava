import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroments/environment";
import {Observable} from "rxjs";
import {User} from "../../shared/modules/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected readonly apiUrl = environment.apiUrl;
  protected readonly contactsUrl = `${this.apiUrl}/api/v1/user`;

  constructor(
    private http: HttpClient,
  ) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.contactsUrl).pipe();
  }

  getUserById(id: string): Observable<User> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.get<User>(url).pipe();
  }

  createUser(body: User): Observable<User> {
    return this.http.post<User>(this.contactsUrl, body).pipe();
  }

  updateUser(id: string, body: User): Observable<User> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.put<User>(url, body).pipe();
  }

  deleteUser(id: string): Observable<User> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.delete<User>(url).pipe();
  }
}
