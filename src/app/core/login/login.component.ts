import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginService } from './login.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Login } from '../../shared/modules/login';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, Button, TranslateModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  login: string = '';
  password: string = '';

  constructor(
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private messageService: MessageService,
    private translate: TranslateService
  ) {}

  onSubmit() {
    this.loginService.login({ login: this.login, password: this.password }).subscribe({
      next: (res: Login) => {
        this.localStorageService.saveToken(res.token);
        this.router.navigate(['']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.instant('CORE.error'),
          detail: this.translate.instant('LOGIN.error'),
          life: 2000,
        });
      },
    });
  }
}
