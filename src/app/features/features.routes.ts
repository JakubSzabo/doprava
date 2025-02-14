import { Route } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';

export default [
  {
    path: '',
    loadChildren: () => import('./phm/phm.routes'),
    canActivate: [authGuard],
  },
  {
    path: 'route',
    loadChildren: () => import('./route/route.routes'),
    canActivate: [authGuard],
  },
  {
    path: 'employee',
    loadChildren: () => import('./employee/employee.router'),
    canActivate: [authGuard],
  },
] as Route[];
