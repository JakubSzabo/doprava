import { Component } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import { UserManagementComponent } from '../user-management/user-management.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule,
    UserManagementComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
