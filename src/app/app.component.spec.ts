import { Subject, of } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { AppComponent } from './app.component';
it('reflects authentication when navigation completes', () => {
  const component = new AppComponent({ events: new Subject() } as any, { authState: of({ uid: 'alice' }) } as any,
    { detectChanges: () => {} } as any, { matchMedia: () => ({ addEventListener: () => {}, removeListener: () => {} }) } as any);
  component.navigationInterceptor(new NavigationEnd(1, '/', '/'));
  expect(component.showLogoutButton).toBe(true);
  component.ngOnDestroy();
});
