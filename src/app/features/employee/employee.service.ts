import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../../shared/modules/employee';
import { EMPLOYEE_API } from '../../shared/api/api';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(EMPLOYEE_API).pipe();
  }

  getUserById(id: string): Observable<Employee> {
    const url = `${EMPLOYEE_API}/${id}`;
    return this.http.get<Employee>(url).pipe();
  }

  createUser(body: Employee): Observable<Employee> {
    return this.http.post<Employee>(EMPLOYEE_API, body).pipe();
  }

  updateUser(id: string, body: Employee): Observable<Employee> {
    const url = `${EMPLOYEE_API}/${id}`;
    return this.http.put<Employee>(url, body).pipe();
  }

  deleteUser(id: string): Observable<Employee> {
    const url = `${EMPLOYEE_API}/${id}`;
    return this.http.delete<Employee>(url).pipe();
  }
}
