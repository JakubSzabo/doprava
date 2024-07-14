import { Routes } from '@angular/router';
import {LayoutComponent} from "./core/layout/layout.component";

export const routes: Routes = [
  // {
  //   path: 'login',
  //   component: ,
  // },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./features/features.routes')
  },
  { path: '**', redirectTo: '/not-found' },
];
