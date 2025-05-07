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

  searchTerm: string = '';
  first: number = 0;
  rows: number = 20;

  constructor(
    public dialog: MatDialog,
    public userService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  add(): void {
    const dialogRef = this.dialog.open(EmployeeManagementComponent, {
      data: {},
      height: '80%',
    });

    dialogRef.afterClosed().subscribe((result: Employee): void => {
      if (result) {
        this.userService.createUser(result).subscribe((_: Employee) => {
          this.getAllUsers();
        });
      }
    });
  }

  edit(id: string): void {
    this.userService.getUserById(id).subscribe((user: Employee): void => {
      const dialogRef = this.dialog.open(EmployeeManagementComponent, {
        data: { user: user },
        height: '80%',
      });

      dialogRef.afterClosed().subscribe((result: Employee): void => {
        if (result) {
          this.userService.updateUser(id, result).subscribe((_: Employee): void => {
            this.getAllUsers();
          });
        }
      });
    });
  }

  delete(id?: string): void {
    if (!id) return;
    this.userService.deleteUser(id).subscribe((_: Employee): void => {
      this.getAllUsers();
    });
  }

  filterUsers(): void {
    this.filteredEmployees = this.employee.filter(
      (employee: Employee): boolean | undefined =>
        (employee.firstName + ' ' + employee.lastName)
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        employee.vehicleType?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.licensePlate?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.first = 0;
    this.updatePaginatedUsers();
  }

  private getAllUsers(): void {
    this.userService.getAllUsers().subscribe((res: Employee[]) => {
      this.employee = res;
      this.filteredEmployees = res;
      this.paginatedEmployees = res.slice(0, 20);
      this.updatePaginatedUsers();
    });
  }

  private updatePaginatedUsers(): void {
    this.paginatedEmployees = this.filteredEmployees.slice(this.first, this.first + this.rows);
  }
}
