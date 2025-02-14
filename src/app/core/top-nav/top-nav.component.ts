import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = [
      {
        label: this.translate.instant('NAV.phm'),
        icon: 'pi pi-gauge',
        command: () => this.navigate('phm'),
      },
      {
        label: this.translate.instant('NAV.employee'),
        icon: 'pi pi-employee',
        command: () => this.navigate('employee'),
      },
      {
        label: this.translate.instant('NAV.route'),
        icon: 'pi pi-truck',
        command: () => this.navigate('route'),
      },
      {
        label: this.translate.instant('NAV.logout'),
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  private logout() {
    this.localStorageService.deleteToken();
    this.router.navigate(['/login']);
  }

  private navigate(link: string) {
    this.router.navigate([`/${link}`]);
  }
}
