import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import {Todo} from "../../models/todo.model";

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(private firestore: AngularFirestore) {

  }

  getTodos() {
    return this.firestore.collection('todos').snapshotChanges();
  }

  createTodo(task: Todo) {
    return this.firestore.collection('todos').add(task);
  }

  updateTodo(task: Todo) {
    this.firestore.doc('todos/' + task.id).update(task);
  }

  deleteTodo(taskId: string) {
    this.firestore.doc('todos/' + taskId).delete();
  }

}
