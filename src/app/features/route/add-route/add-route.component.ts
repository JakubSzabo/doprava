import { Component, Inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Route } from '../../../shared/modules/route';

@Component({
  selector: 'app-add-route',
  standalone: true,
  imports: [TranslateModule, FormsModule],
  templateUrl: './add-route.component.html',
})
export class AddRouteComponent {
  constructor(
    public dialogRef: MatDialogRef<AddRouteComponent>,
    @Inject(MAT_DIALOG_DATA) public route: Route
  ) {}

  add() {
    if (this.route.route == undefined || this.route.distance == undefined) return;
    this.dialogRef.close(this.route);
  }

  checkRoute() {
    return !(this.route.distance > 0 && this.route.route.trim());
  }
}
