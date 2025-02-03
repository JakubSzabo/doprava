import {Component, Inject, OnInit} from '@angular/core';
import { User } from '../../../shared/modules/user';
import { UserTableComponent } from '../user.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [UserTableComponent, FormsModule, TranslateModule, ReactiveFormsModule, MatInput],
  standalone: true
})
export class UserManagementComponent implements OnInit {
  user: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    vehicleType: '',
    licensePlate: '',
    consumption: 0,
    odometer: 0,
    tankStatus: 0
  };

  constructor(
    public dialogRef: MatDialogRef<UserManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    if (this.data.user) {
      this.user = this.data.user;
    }
  }

  add() {
    this.dialogRef.close(this.user);
  }
}
