import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Todo } from '../../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  getTodos(): Observable<Todo[]> {
    return this.auth.authState.pipe(switchMap(user => user
      ? this.firestore.collection<Todo>(`users/${user.uid}/todos`).valueChanges({ idField: 'id' })
      : of([])));
  }

  private async collection() {
    const user = await this.auth.currentUser;
    if (!user) { throw new Error('Sign in to manage tasks.'); }
    return this.firestore.collection<Todo>(`users/${user.uid}/todos`);
  }

  private values(task: Todo): Pick<Todo, 'description' | 'isComplete'> {
    const description = task.description.trim();
    if (!description || description.length > 500 || typeof task.isComplete !== 'boolean') {
      throw new Error('Enter a task between 1 and 500 characters.');
    }
    return { description, isComplete: task.isComplete };
  }

  async createTodo(task: Todo): Promise<void> {
    const data = this.values(task);
    const collection = await this.collection();
    await collection.add(data);
  }

  async updateTodo(task: Todo): Promise<void> {
    if (!task.id || task.id.includes('/')) { throw new Error('Invalid task.'); }
    const data = this.values(task);
    const collection = await this.collection();
    await collection.doc(task.id).update(data);
  }

  async deleteTodo(id: string): Promise<void> {
    if (!id || id.includes('/')) { throw new Error('Invalid task.'); }
    const collection = await this.collection();
    await collection.doc(id).delete();
  }
}
