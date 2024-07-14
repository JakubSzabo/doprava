import { Component, Input } from '@angular/core';
import { User } from '../../shared/modules/user';

@Component({
  selector: 'app-user-table',
  templateUrl: './uzivatel.component.html',
  styleUrls: ['./uzivatel.component.scss'],
  standalone: true,
})
export class UserTableComponent {
  @Input() users: User[] = [];
}
