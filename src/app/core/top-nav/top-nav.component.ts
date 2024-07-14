import { Component, OnInit } from '@angular/core';
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
        lable: 'Uživateľ',
        icon: 'pi-user',
      },
    ];
  }
}
