import {Route} from "@angular/router";

export default [
  {
    path: "",
    loadChildren: () => import('./home/home.routes')
  },
  {
    path: "user",
    loadChildren: () => import('./uzivatel/uzivatel.router')
  }
] as Route[];
