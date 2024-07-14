import { Component, OnInit } from '@angular/core';
import { triggerAsyncId } from 'async_hooks';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './top-nav.component.html',
  styleUrl: './top-nav.component.scss',
})
export class TopNavComponent implements OnInit {
  items: any[] | undefined;

  ngOnInit(): void {
    this.items = [
      {
        label: 'Uživateľ',
        icon: 'pi pi-user',
        url: '/user'
      },
      {
        label: 'trasy',
        icon: 'pi pi-truck',
        url: ''
      },
    ];
  }
}
