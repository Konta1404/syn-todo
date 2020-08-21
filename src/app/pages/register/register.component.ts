import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { switchMap, first, mapTo, take } from 'rxjs/operators';
import { auth } from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onErrorCreate() {

  }

  createUser() {
    const { email, password, fullName } = this.registerForm.value;
    from(this.auth.createUserWithEmailAndPassword(email, password))
      .pipe(
        switchMap(({ user }) => this.metadataCreateWatcher(user)),
        take(1),
        switchMap((user) => from(user.getIdToken(true)).pipe(mapTo(user))),
      )
      .subscribe(() => this.router.navigate(['']), (error) => {
        console.log(error.code);
        switch(error.code) {
          case "auth/invalid-email":
          case "auth/wrong-password":
          case "auth/user-not-found":
          {
            this.registerForm.controls.email.hasError(error.code);
            this.registerForm.controls.email.markAsDirty();
            console.log(this.registerForm);
            break;
          }
          {
            this.registerForm.controls.password.hasError(error.code);
          }
          {
            this.registerForm.controls.fullName.hasError(error.code);
            break;
          }
        }
        this.registerForm.controls.fullName.hasError(error.status);
        this.registerForm.controls.email.hasError(error.status);
        this.registerForm.controls.password.hasError(error.status);
      });
  }

  createUserViaGoogle() {
    from(this.auth.signInWithPopup(new auth.GoogleAuthProvider()))
      .pipe(
        switchMap(({ user }) => this.metadataCreateWatcher(user)),
        take(1),
        switchMap((user) => from(user.getIdToken(true)).pipe(mapTo(user))),
      )
      .subscribe(() => this.router.navigate(['']), console.error);
  }

  private metadataCreateWatcher(user: firebase.User) {
    return this.db
      .object(`metadata/${user.uid}/refreshTime`)
      .valueChanges()
      .pipe(
        first((refreshTime) => !!refreshTime),
        mapTo(user)
      );
  }

}
