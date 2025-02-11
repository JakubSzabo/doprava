import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadChildren: () => import('./phm/phm.routes'),
  },
  {
    path: 'route',
    loadChildren: () => import('./route/route.routes'),
  },
  {
    path: 'employee',
    loadChildren: () => import('./user/employee.router'),
  },
] as Route[];
