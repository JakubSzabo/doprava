import { Route } from '@angular/router';
import { AdminComponent } from './admin.component';

export default [{ path: '', component: AdminComponent, data: { id: 'admin' } }] as Route[];
