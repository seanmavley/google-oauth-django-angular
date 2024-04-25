import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: '', canActivate: [authGuard], loadChildren: () => import('./dash/dash.module').then(m => m.DashModule) }
];
