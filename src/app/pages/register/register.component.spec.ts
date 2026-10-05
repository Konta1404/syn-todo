import { FormBuilder } from '@angular/forms';
import { RegisterComponent } from './register.component';
it('creates a profile without waiting for an undocumented database writer', async () => {
  const updateProfile = jasmine.createSpy().and.returnValue(Promise.resolve());
  const navigate = jasmine.createSpy().and.returnValue(Promise.resolve(true));
  const component = new RegisterComponent(new FormBuilder(), { createUserWithEmailAndPassword: () => Promise.resolve({ user: { updateProfile } }) } as any, { navigate } as any);
  component.ngOnInit(); component.registerForm.setValue({ fullName: ' Alice ', email: 'a@example.com', password: 'password123' });
  await component.createUser(); expect(updateProfile).toHaveBeenCalledWith({ displayName: 'Alice' }); expect(navigate).toHaveBeenCalled();
});
