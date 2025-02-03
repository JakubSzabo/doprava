import {Component, OnInit} from '@angular/core';
import { User } from '../../shared/modules/user';
import { TranslateModule } from "@ngx-translate/core";
import { MatDialog } from "@angular/material/dialog";
import { UserManagementComponent } from "./user-management/user-management.component";
import {UserService} from "./user.service";

@Component({
  selector: 'app-user-table',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [
    TranslateModule
  ]
})
export class UserTableComponent implements OnInit{
  users: User[] = [];

  constructor(
    public dialog: MatDialog,
    public userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  private getAllUsers() {
    this.userService.getAllUsers().subscribe(res => {
      this.users = res;
    })
  }

  add(): void {
    const dialogRef = this.dialog.open(
      UserManagementComponent,
      {
        data: {},
        height: '80%'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createUser(result).subscribe(res => {
          this.getAllUsers();
        });
      }
    })
  }

  edit(id: string) {
    this.userService.getUserById(id).subscribe(user => {
      console.log(user)
      const dialogRef = this.dialog.open(
        UserManagementComponent,
        {
          data: {user: user},
          height: '80%'
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userService.updateUser(id, result).subscribe(res => {
            this.getAllUsers();
          });
        }
      })
    })
  }

  delete(id?: string) {
    if(!id) return;
    this.userService.deleteUser(id).subscribe(_ => {
      this.getAllUsers();
    })
  }
}
