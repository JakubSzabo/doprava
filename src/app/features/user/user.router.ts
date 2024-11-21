import {Route} from "@angular/router";
import {UserTableComponent} from "./user.component";

export default [
  { path: '', component: UserTableComponent, data: { id: 'user' } },
] as Route[];
