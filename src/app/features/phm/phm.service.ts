import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Select } from '../../shared/modules/core';
import { Employee } from '../../shared/modules/employee';
import { Route } from '../../shared/modules/route';
import { EMPLOYEE_API, ROUTE_API } from '../../shared/api/api';

@Injectable({
  providedIn: 'root',
})
export class PhmService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<Select[]> {
    return this.http.get<Select[]>(EMPLOYEE_API).pipe();
  }

  getUserById(id: string): Observable<Employee> {
    const url = `${EMPLOYEE_API}/${id}`;
    return this.http.get<Employee>(url).pipe();
  }

  getAllRoute(): Observable<Route[]> {
    return this.http.get<Route[]>(ROUTE_API).pipe();
  }
}
