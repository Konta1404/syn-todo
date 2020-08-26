import { NgModule } from '@angular/core';
import {Routes, RouterModule, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';
import {pipe} from "rxjs";
import { tap } from 'rxjs/operators';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = redirectLoggedInTo(['']);
const redirectToHomeWithLogin = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) =>
  pipe(
    tap(() => console.info('it will be redirected')),
    redirectToHome
  );

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule), ...canActivate(redirectToHomeWithLogin) },
  { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule), ...canActivate(redirectToHomeWithLogin) },
  { path: 'todo', loadChildren: () => import('./pages/todo/todo.module').then(m => m.TodoModule), ...canActivate(redirectUnauthorizedToLogin) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
