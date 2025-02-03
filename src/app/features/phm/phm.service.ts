import { Injectable } from '@angular/core';
import {environment} from "../../../enviroments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Select} from "../../shared/modules/core";
import {User} from "../../shared/modules/user";
import {Route} from "../../shared/modules/route";

@Injectable({
  providedIn: 'root'
})
export class PhmService {
  protected readonly apiUrl = environment.apiUrl;
  protected readonly userUrl = `${this.apiUrl}/api/v1/user`;
  protected readonly routeUrl = `${this.apiUrl}/api/v1/route`;

  constructor(
    private http: HttpClient,
  ) { }

  getAllUsers(): Observable<Select[]> {
    const url = `${this.userUrl}/options`;
    return this.http.get<Select[]>(url).pipe();
  }

  getUserById(id: string): Observable<User> {
    const url = `${this.userUrl}/${id}`;
    return this.http.get<User>(url).pipe();
  }

  getAllRoute(): Observable<Route[]> {
    return this.http.get<Route[]>(this.routeUrl).pipe();
  }
}
