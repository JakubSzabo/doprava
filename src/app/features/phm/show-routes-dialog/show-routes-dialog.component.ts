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
})
export class ShowRoutesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowRoutesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { routes: GeneratedRoutes[]; distance: number }
  ) {}

  confirm(): void {
    this.dialogRef.close(this.data.routes);
  }

  delete(id: string): void {
    const index = this.data.routes.findIndex((e: GeneratedRoutes) => e.id === id);
    if (index > -1) {
      this.data.routes.splice(index, 1);
    }
  }

  sum(): number {
    let distance = 0;
    this.data.routes.forEach((route: GeneratedRoutes): void => {
      distance += route.distance;
    });

    return distance;
  }
}
