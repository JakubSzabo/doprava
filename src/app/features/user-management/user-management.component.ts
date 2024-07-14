import { Component } from '@angular/core';
import { User } from '../../shared/modules/user';
import { UserTableComponent } from '../uzivatel/uzivatel.component';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [UserTableComponent, FormsModule],
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
    console.log("HERE")
    this.users.push({ ...this.newUser });
    this.newUser = {
      name: '',
      vehicleType: '',
      licensePlate: '',
      consumption: 0,
      odometer: 0,
      tankStatus: 0,
    };
    console.log(this.users)
  }
}
