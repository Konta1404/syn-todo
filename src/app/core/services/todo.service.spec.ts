import { of } from 'rxjs';
import { TodoService } from './todo.service';

describe('TodoService ownership and writes', () => {
  let collection: jasmine.Spy;
  let update: jasmine.Spy;
  let add: jasmine.Spy;
  let service: TodoService;
  beforeEach(() => {
    update = jasmine.createSpy().and.returnValue(Promise.resolve());
    add = jasmine.createSpy().and.returnValue(Promise.resolve());
    collection = jasmine.createSpy().and.returnValue({ valueChanges: () => of([]), add, doc: () => ({ update, delete: () => Promise.resolve() }) });
    service = new TodoService({ collection } as any, { authState: of({ uid: 'alice' }), currentUser: Promise.resolve({ uid: 'alice' }) } as any);
  });
  it('subscribes only to the signed-in user collection', () => {
    service.getTodos().subscribe();
    expect(collection).toHaveBeenCalledWith('users/alice/todos');
  });
  it('returns write failures and excludes document IDs from data', async () => {
    update.and.returnValue(Promise.reject(new Error('offline')));
    await expectAsync(service.updateTodo({ id: 'one', description: ' task ', isComplete: false })).toBeRejected();
    expect(update).toHaveBeenCalledWith({ description: 'task', isComplete: false });
  });
  it('rejects blank tasks before writing', async () => {
    await expectAsync(service.createTodo({ description: '   ', isComplete: false })).toBeRejected();
    expect(add).not.toHaveBeenCalled();
  });
  it('does not write when signed out', async () => {
    service = new TodoService({ collection } as any, { currentUser: Promise.resolve(null) } as any);
    await expectAsync(service.createTodo({ description: 'task', isComplete: false })).toBeRejected();
    expect(collection).not.toHaveBeenCalled();
  });
});
