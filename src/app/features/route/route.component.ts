import { Component } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { UserManagementComponent } from '../user/user-management/user-management.component';
import {MatDialog} from "@angular/material/dialog";
import {Route} from "../../shared/modules/route";
import {AddRouteComponent} from "./add-route/add-route.component";

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    TranslateModule,
    UserManagementComponent
  ],
  templateUrl: './route.component.html',
})
export class RouteComponent {
  public routes: Route[] = []
  constructor(
    public dialog: MatDialog
  ) {
  }

  add(): void {
    const dialogRef = this.dialog.open(
      AddRouteComponent,
      {
        data: {}
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log("Result: ", result);
      this.routes.push(result);
    })
  }
}
