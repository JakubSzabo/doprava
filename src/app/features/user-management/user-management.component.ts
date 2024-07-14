import { Component } from '@angular/core';
import { User } from '../../shared/modules/user';
import { UserTableComponent } from '../uzivatel/uzivatel.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [UserTableComponent],
  styleUrls: ['./user-management.component.scss'],
  standalone: true
})
export class UserManagementComponent {
  users: User[] = [];

  newUser: User = {
    name: '',
    vehicleType: '',
    licensePlate: '',
    consumption: 0,
    odometer: 0,
    tankStatus: 0,
  };

  addUser() {
    this.users.push({ ...this.newUser });
    this.newUser = {
      name: '',
      vehicleType: '',
      licensePlate: '',
      consumption: 0,
      odometer: 0,
      tankStatus: 0,
    };
  }
}
