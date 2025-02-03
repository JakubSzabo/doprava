import {Component, OnInit} from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { UserManagementComponent } from '../user/user-management/user-management.component';
import {MatDialog} from "@angular/material/dialog";
import {Route} from "../../shared/modules/route";
import {AddRouteComponent} from "./add-route/add-route.component";
import {RouteService} from "./route.service";

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    TranslateModule,
    UserManagementComponent
  ],
  templateUrl: './route.component.html',
})
export class RouteComponent implements OnInit{
  public routes: Route[] = []
  constructor(
    public dialog: MatDialog,
    public routeService: RouteService,
  ) {
  }

  ngOnInit(): void {
    this.getAllRoutes();
  }

  private getAllRoutes() {
    this.routeService.getAllRoute().subscribe(res => {
      this.routes = res;
    })
  }

  add(): void {
    const dialogRef = this.dialog.open(
      AddRouteComponent,
      {
        data: {}
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      this.routeService.createRoute(result).subscribe(_ => {
          this.getAllRoutes();
        }
      )
    })
  }

  delete(id?: string) {
    if (!id) return;
    this.routeService.deleteRoute(id).subscribe( _ => {
        this.getAllRoutes();
      }
    )
  }
}
