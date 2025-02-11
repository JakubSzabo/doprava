import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getToken();

  const modifiedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(modifiedReq);
};
