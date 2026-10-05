import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { auth } from 'firebase/app';
import 'firebase/auth';

@Component({ selector: 'app-login', templateUrl: './login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  pending = false;
  error = '';
  constructor(private fb: FormBuilder, private auth: AngularFireAuth, private router: Router) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  }
  get f() { return this.loginForm.controls; }
  private async signIn(action: () => Promise<unknown>): Promise<void> {
    if (this.pending) { return; }
    this.pending = true;
    this.error = '';
    try { await action(); await this.router.navigate(['']); }
    catch { this.error = 'Sign-in failed. Check your details or try again.'; }
    finally { this.pending = false; }
  }
  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) { return; }
    const { email, password } = this.loginForm.value;
    await this.signIn(() => this.auth.signInWithEmailAndPassword(email.trim(), password));
  }
  async onLoginWithGoogle(): Promise<void> {
    await this.signIn(() => this.auth.signInWithPopup(new auth.GoogleAuthProvider()));
  }
  async onLogout(): Promise<void> {
    try { await this.auth.signOut(); await this.router.navigate(['login']); }
    catch { this.error = 'Sign-out failed. Please retry.'; }
  }
}
