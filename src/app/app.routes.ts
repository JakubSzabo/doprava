import { Routes } from '@angular/router';
import {TestComponent} from "./core/test/test.component";
import {LayoutComponent} from "./core/layout/layout.component";

export const routes: Routes = [
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./features/features.routes')
  },
  { path: '**', redirectTo: '/not-found' },
];
