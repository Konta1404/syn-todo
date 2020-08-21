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
import {ToolbarService} from "./core/services/toolbar-service/toolbar.service";
import {MatDrawer} from "@angular/material/sidenav";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [

  ]
})
export class AppComponent implements OnInit {
  title = 'syn-todo';

  loading = true;
  @ViewChild('drawer') public drawer: MatDrawer;

  constructor(private router:Router,
              private auth: AngularFireAuth,
              @Inject(ToolbarService) private toolbarService: ToolbarService,
              changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.router.events.subscribe((e: RouterEvent) => {
      this.navigationInterceptor(e);
    })
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {
    this.toolbarService.setDrawer(this.drawer);
  }

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from({length: 50}, () =>
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  private _mobileQueryListener: () => void;


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  onLogout() {
    this.auth
      .signOut()
      .then(() => this.router.navigate(['login']));
  }

  toggleDrawer() {
    this.toolbarService.toggle();
  }

  navigationInterceptor(event: RouterEvent) {

    switch (event.constructor) {
      case NavigationStart: {
        this.loading = true;
        break;
      }
      case NavigationEnd:
      case NavigationCancel:
      case NavigationError: {
        this.loading = false;
        break;
      }
      default: {
        break;
      }
    }
  }

}
