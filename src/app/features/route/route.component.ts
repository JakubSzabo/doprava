import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeManagementComponent } from '../employee/employee-management/employee-management.component';
import { MatDialog } from '@angular/material/dialog';
import { Route } from '../../shared/modules/route';
import { AddRouteComponent } from './add-route/add-route.component';
import { RouteService } from './route.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    TranslateModule,
    EmployeeManagementComponent,
    FormsModule,
    InputTextModule,
    PaginatorModule,
    TableModule,
  ],
  templateUrl: './route.component.html',
})
export class RouteComponent implements OnInit {
  public routes: Route[] = [];

  filteredRoutes: Route[] = [];
  paginatedRoutes: Route[] = [];

  searchTerm = '';
  first = 0;
  rows = 20;
  constructor(
    public dialog: MatDialog,
    public routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.getAllRoutes();
  }

  private getAllRoutes() {
    this.routeService.getAllRoute().subscribe((res) => {
      this.routes = res;
      this.filteredRoutes = res;
      this.paginatedRoutes = res.slice(0, 20);
    });
  }

  filterRoutes() {
    this.filteredRoutes = this.routes.filter((route) =>
      route.route.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  updatePaginatedUsers() {
    this.paginatedRoutes = this.filteredRoutes.slice(this.first, this.first + this.rows);
  }

  add(): void {
    const dialogRef = this.dialog.open(AddRouteComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.routeService.createRoute(result).subscribe((_) => {
        this.getAllRoutes();
      });
    });
  }

  delete(id?: string) {
    if (!id) return;
    this.routeService.deleteRoute(id).subscribe((_) => {
      this.getAllRoutes();
    });
  }
}
