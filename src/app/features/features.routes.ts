import {Route} from "@angular/router";

export default [
  {
    path: "",
    loadChildren: () => import('./phm/phm.routes')
  },
  {
    path: "route",
    loadChildren: () => import('./route/route.routes')
  },
  {
    path: "user",
    loadChildren: () => import('./user/user.router')
  },
] as Route[];
