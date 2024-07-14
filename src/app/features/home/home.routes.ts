import {HomeComponent} from "./home.component";
import {Route} from "@angular/router";

export default [
  { path: '', component: HomeComponent, data: { id: 'home' } },
] as Route[];
