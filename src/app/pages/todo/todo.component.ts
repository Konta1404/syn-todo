import { Component, OnInit } from '@angular/core';
import {TodoService} from "../../core/services/todo.service";
import {Todo} from "../../models/todo.model";
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todos: Todo[];
  loading: boolean = false;
  todoFormControl = new FormControl('');
  columnDefs: string[] = ['done', 'id', 'description', 'remove'];

  constructor(private todoService: TodoService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this.todoFormControl = this.formBuilder.group({
    //   task: [null, [Validators.required]],
    // });
    this.getTodos();
  }

  getTodos() {
    this.loading = true;
    this.todoService.getTodos()
      .subscribe(data => {
        // Couldn't use firebase
        this.loading = false;
        this.todos = data.map(e => {
          return {
            id: e.payload.doc.id,
            description: e.payload.doc.data()['description'],
            isComplete: e.payload.doc.data()['isComplete'],
          } as Todo;
        })
    });
  }


  addNewTodo(task) {
    let taskObject: Todo = {
      description: task,
      isComplete: false
    }
    this.todoService.createTodo(taskObject);
  }

  deleteTodo(task) {
    this.todoService.deleteTodo(task);
  }

  updateTodo(task) {
    this.todoService.updateTodo(task)
  }

}
