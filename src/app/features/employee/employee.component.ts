import { Component, OnInit } from '@angular/core';
import { Employee } from '../../shared/modules/employee';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { EmployeeService } from './employee.service';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee.component.html',
  standalone: true,
  imports: [TranslateModule, PaginatorModule, InputTextModule, TableModule],
})
export class UserTableComponent implements OnInit {
  employee: Employee[] = [];

  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];

  searchTerm = '';
  first = 0;
  rows = 20;

  constructor(
    public dialog: MatDialog,
    public userService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  private getAllUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      this.employee = res;
      this.filteredEmployees = res;
      this.paginatedEmployees = res.slice(0, 20);
      this.updatePaginatedUsers();
    });
  }

  filterUsers() {
    this.filteredEmployees = this.employee.filter(
      (employee) =>
        (employee.firstName + ' ' + employee.lastName)
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        employee.vehicleType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.licensePlate.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.first = 0;
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers() {
    this.paginatedEmployees = this.filteredEmployees.slice(this.first, this.first + this.rows);
  }

  add(): void {
    const dialogRef = this.dialog.open(EmployeeManagementComponent, {
      data: {},
      height: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.createUser(result).subscribe((res) => {
          this.getAllUsers();
        });
      }
    });
  }

  edit(id: string) {
    this.userService.getUserById(id).subscribe((user) => {
      const dialogRef = this.dialog.open(EmployeeManagementComponent, {
        data: { user: user },
        height: '80%',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.userService.updateUser(id, result).subscribe((res) => {
            this.getAllUsers();
          });
        }
      });
    });
  }

  delete(id?: string) {
    if (!id) return;
    this.userService.deleteUser(id).subscribe((_) => {
      this.getAllUsers();
    });
  }
}
