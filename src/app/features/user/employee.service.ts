import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/environment';
import { Observable } from 'rxjs';
import { Employee } from '../../shared/modules/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  protected readonly apiUrl = environment.apiUrl;
  protected readonly contactsUrl = `${this.apiUrl}/api/v1/employee`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.contactsUrl).pipe();
  }

  getUserById(id: string): Observable<Employee> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.get<Employee>(url).pipe();
  }

  createUser(body: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.contactsUrl, body).pipe();
  }

  updateUser(id: string, body: Employee): Observable<Employee> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.put<Employee>(url, body).pipe();
  }

  deleteUser(id: string): Observable<Employee> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.delete<Employee>(url).pipe();
  }
}
