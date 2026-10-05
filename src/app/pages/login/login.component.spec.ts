import { FormBuilder } from '@angular/forms';
import { LoginComponent } from './login.component';
it('reports sign-in failure without navigating', async () => {
  const navigate = jasmine.createSpy();
  const component = new LoginComponent(new FormBuilder(), { signInWithEmailAndPassword: () => Promise.reject(new Error('invalid')) } as any, { navigate } as any);
  component.ngOnInit(); component.loginForm.setValue({ email: 'a@example.com', password: 'bad' });
  await component.onLogin();
  expect(component.error).toBeTruthy(); expect(component.pending).toBe(false); expect(navigate).not.toHaveBeenCalled();
});
