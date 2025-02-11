import { Route } from '@angular/router';
import { UserTableComponent } from './employee.component';

export default [{ path: '', component: UserTableComponent, data: { id: 'user' } }] as Route[];
