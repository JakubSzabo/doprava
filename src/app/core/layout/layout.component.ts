import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {TopNavComponent} from "../top-nav/top-nav.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    TopNavComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
