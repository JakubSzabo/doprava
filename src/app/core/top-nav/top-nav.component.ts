import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit(): void {
    //TODO: Add translations fpr nav
    this.items = [
      {
        label: 'PHM',
        icon: 'pi pi-gauge',
        url: '',
      },
      {
        label: 'Zamestnanec',
        icon: 'pi pi-user',
        url: '/employee',
      },
      {
        label: 'Trasy',
        icon: 'pi pi-truck',
        url: '/route',
      },
    ];
  }
}
