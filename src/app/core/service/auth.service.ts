import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User
  constructor(public  afAuth:  AngularFireAuth, public  router:  Router) {

  }

}
export namespace ErrorAuth {
  export function convertMessage(code: string, message: string): string {
    switch (code) {
      case 'auth/user-disabled': {
        return  message;
      }
      case 'auth/user-not-found': {
        return  message;
      }
      case "auth/invalid-email": {
        return message;
      }
      case "auth/wrong-password": {
        return message;
      }
      default: {
        return  message;
      }
    }
  }
}
