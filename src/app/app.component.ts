import {Component, OnInit, ViewChild, Inject, ChangeDetectorRef} from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError, Route
} from '@angular/router';
import {AngularFireAuth} from "@angular/fire/auth";
import {MatDrawer} from "@angular/material/sidenav";
import {MediaMatcher} from "@angular/cdk/layout";
import {first, tap} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [

  ]
})
export class AppComponent implements OnInit {
  title = 'syn-todo';
  showLogoutButton: boolean = false;
  loading = true;
  @ViewChild('drawer') public drawer: MatDrawer;

  constructor(private router:Router,
              private auth: AngularFireAuth,
              changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    })
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {

  }

  isLoggedIn() {
    return this.auth.authState.pipe(first())
  }

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onLogout() {
    this.auth
      .signOut()
      .then(() => this.router.navigate(['login']));
  }

  navigationInterceptor(event: RouterEvent) {
    this.isLoggedIn().pipe(
      tap(user => {
        if (user) {
          this.showLogoutButton = true;
        } else {
          this.showLogoutButton = false;
        }
      })
    ).subscribe()

    switch (event.constructor) {
      case NavigationStart: {
        this.loading = true;
        break;
      }
      case NavigationEnd:
      case NavigationCancel:
      case NavigationError: {
        setTimeout(()=> {
          this.loading = false;
        },2000)
        break;
      }
      default: {
        break;
      }
    }
  }

}
