import { Injectable } from '@angular/core';
import {environment} from "../../../enviroments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Route} from "../../shared/modules/route";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  protected readonly apiUrl = environment.apiUrl;
  protected readonly contactsUrl = `${this.apiUrl}/api/v1/route`;

  constructor(
    private http: HttpClient,
  ) { }

  getAllRoute(): Observable<Route[]> {
    return this.http.get<Route[]>(this.contactsUrl).pipe();
  }

  createRoute(body: Route): Observable<Route> {
    return this.http.post<Route>(this.contactsUrl, body).pipe();
  }

  deleteRoute(id: string): Observable<Route> {
    const url = `${this.contactsUrl}/${id}`;
    return this.http.delete<Route>(url).pipe();
  }
}
