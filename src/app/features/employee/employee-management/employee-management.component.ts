import { Component, Inject, OnInit } from '@angular/core';
import { Employee } from '../../../shared/modules/employee';
import { UserTableComponent } from '../employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  imports: [
    UserTableComponent,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatInput,
    Button,
  ],
  standalone: true,
})
export class EmployeeManagementComponent implements OnInit {
  employee: Employee = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    vehicleType: '',
    licensePlate: '',
    consumption: 0,
    odometer: 0,
    tankStatus: 0,
  };

  constructor(
    public dialogRef: MatDialogRef<EmployeeManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.user) {
      this.employee = this.data.user;
    }
  }

  add() {
    this.dialogRef.close(this.employee);
  }

  checkEmployee(): boolean {
    return !(
      this.employee.firstName.trim() &&
      this.employee.lastName.trim() &&
      this.employee.vehicleType.trim() &&
      this.employee.licensePlate.trim() &&
      this.employee.consumption > 0 &&
      this.employee.odometer >= 0 &&
      this.employee.tankStatus >= 0
    );
  }
}
