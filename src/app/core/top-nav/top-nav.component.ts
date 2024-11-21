import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from "primeng/api";

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      {
        label: 'PHM',
        icon: 'pi pi-gauge',
        url: ''
      },
      {
        label: 'Uživateľ',
        icon: 'pi pi-user',
        url: '/user'
      },
      {
        label: 'Trasy',
        icon: 'pi pi-truck',
        url: '/route'
      },
    ];
  }
}
