import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from '../../shared/modules/route';
import { ROUTE_API } from '../../shared/api/api';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor(private http: HttpClient) {}

  getAllRoute(): Observable<Route[]> {
    return this.http.get<Route[]>(ROUTE_API).pipe();
  }

  createRoute(body: Route): Observable<Route> {
    return this.http.post<Route>(ROUTE_API, body).pipe();
  }

  deleteRoute(id: string): Observable<Route> {
    const url = `${ROUTE_API}/${id}`;
    return this.http.delete<Route>(url).pipe();
  }
}
