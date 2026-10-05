import { FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { TodoComponent } from './todo.component';

describe('TodoComponent failure and lifecycle behavior', () => {
  let component: TodoComponent;
  let data: Subject<any[]>;
  let service: any;
  beforeEach(() => {
    data = new Subject();
    service = { getTodos: () => data, createTodo: jasmine.createSpy().and.returnValue(Promise.resolve()), updateTodo: jasmine.createSpy().and.returnValue(Promise.resolve()) };
    component = new TodoComponent(service, new FormBuilder(), { open: () => ({ afterClosed: () => of(undefined) }) } as any);
    component.ngOnInit();
  });
  afterEach(() => component.ngOnDestroy());
  it('keeps entered text after a failed create', async () => {
    service.createTodo.and.returnValue(Promise.reject(new Error('offline')));
    component.todoForm.setValue({ task: 'Keep this' });
    await component.addNewTodo();
    expect(component.todoForm.value.task).toBe('Keep this');
    expect(component.error).toBeTruthy();
  });
  it('does not save dismissed edit dialogs', () => {
    component.editTodo({ id: 'one', description: 'Task', isComplete: false });
    expect(service.updateTodo).not.toHaveBeenCalled();
  });
  it('preserves the table data source across snapshots', () => {
    const source = component.datasource;
    data.next([{ id: 'one', description: 'Task', isComplete: false }]);
    data.next([]);
    expect(component.datasource).toBe(source);
  });
  it('leaves the snapshot unchanged when a completion write fails', async () => {
    const task = { id: 'one', description: 'Task', isComplete: false };
    data.next([task]);
    service.updateTodo.and.returnValue(Promise.reject(new Error('offline')));
    await component.toggleTodo(task, true);
    expect(component.datasource.data[0].isComplete).toBe(false);
  });
  it('unsubscribes when destroyed', () => {
    component.ngOnDestroy();
    expect(data.observers.length).toBe(0);
  });
});
