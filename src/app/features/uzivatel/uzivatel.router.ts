import {Route} from "@angular/router";
import {UserTableComponent} from "./uzivatel.component";

export default [
  { path: '', component: UserTableComponent, data: { id: 'user' } },
] as Route[];
