import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private localStorageService: LocalStorageService) {}

  getRole(): string | null {
    const token = this.localStorageService.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      return payload.role || null;
    } catch (e) {
      console.error('Invalid JWT token', e);
      return null;
    }
  }
}
