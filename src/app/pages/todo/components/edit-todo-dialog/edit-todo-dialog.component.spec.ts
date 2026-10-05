import { EditTodoDialogComponent } from './edit-todo-dialog.component';
it('cancels without returning a task to update', () => {
  const close = jasmine.createSpy();
  new EditTodoDialogComponent({ close } as any, { description: 'Task', isComplete: false }).onNoClick();
  expect(close).toHaveBeenCalledWith();
});
