import {Route} from "@angular/router";

export default [
  {
    path: "",
    loadChildren: () => import('./home/home.routes')
  },
] as Route[];
