import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GeneratedRoutes } from '../../../shared/modules/route';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-show-routes-dialog',
  standalone: true,
  imports: [DatePipe, TranslateModule],
  templateUrl: './show-routes-dialog.component.html',
  styleUrl: './show-routes-dialog.component.scss',
})
export class ShowRoutesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowRoutesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public routes: GeneratedRoutes[]
  ) {}

  confirm() {
    this.dialogRef.close(this.routes);
  }

  delete(id: string) {
    const index = this.routes.findIndex((e) => e.id === id);
    if (index > -1) {
      this.routes.splice(index, 1);
    }
  }

  sum() {
    let distance = 0;
    this.routes.forEach((route: GeneratedRoutes) => {
      distance += route.distance;
    });

    return distance;
  }
}
