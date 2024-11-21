import { Component, Inject } from '@angular/core';
import { User } from '../../../shared/modules/user';
import { UserTableComponent } from '../user.component';
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  imports: [UserTableComponent, FormsModule, TranslateModule],
  standalone: true
})
export class UserManagementComponent {
  constructor(
    public dialogRef: MatDialogRef<UserManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
  ) {}

  add() {
    this.dialogRef.close(this.user);
  }
}
