import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import 'firebase/auth';

@Component({ selector: 'app-register', templateUrl: './register.component.html', styleUrls: ['./register.component.scss'] })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  pending = false;
  error = '';
  constructor(private fb: FormBuilder, private auth: AngularFireAuth, private router: Router) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/\S/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  get f() { return this.registerForm.controls; }
  private async register(action: () => Promise<unknown>): Promise<void> {
    if (this.pending) { return; }
    this.pending = true;
    this.error = '';
    try { await action(); await this.router.navigate(['']); }
    catch { this.error = 'Registration failed. Please retry, or sign in if your account already exists.'; }
    finally { this.pending = false; }
  }
  async createUser(): Promise<void> {
    if (this.registerForm.invalid) { return; }
    const { email, password, fullName } = this.registerForm.value;
    await this.register(async () => {
      const result = await this.auth.createUserWithEmailAndPassword(email.trim(), password);
      await result.user.updateProfile({ displayName: fullName.trim() });
    });
  }
  async createUserViaGoogle(): Promise<void> {
    await this.register(() => this.auth.signInWithPopup(new auth.GoogleAuthProvider()));
  }
}
