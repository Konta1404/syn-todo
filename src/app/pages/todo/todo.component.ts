import { Component, OnInit, ViewChild } from '@angular/core';
import { TodoService } from "../../core/services/todo.service";
import { Todo } from "../../models/todo.model";
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { EditTodoDialogComponent } from "./components/edit-todo-dialog/edit-todo-dialog.component";

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todos: Todo[];
  datasource: MatTableDataSource<Todo>
  loading: boolean = false;
  todoForm: FormGroup;
  columnDefs: string[] = ['done', 'id', 'description', 'remove'];

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    if (this.datasource) {
      this.datasource.paginator = paginator;
    }
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.datasource) {
      this.datasource.sort = sort;
    }
  }

  constructor(private todoService: TodoService, private fb: FormBuilder, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      task: new FormControl('', Validators.required),
    });
    this.getTodos();
  }

  get f () { return this.todoForm.controls }

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
        this.datasource = new MatTableDataSource(this.todos)
      });
  }


  addNewTodo() {

    if (this.todoForm.invalid) {
      return;
    }

    let taskObject: Todo = {
      description: this.todoForm.get('task').value,
      isComplete: false
    }
    this.todoService.createTodo(taskObject);
  }

  editTodo(task): void {
    const dialogRef = this.dialog.open(EditTodoDialogComponent, {
      width: '500px',
      data: Object.assign({}, task)
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateTodo(result)
    });
  }

  deleteTodo(task) {
    this.todoService.deleteTodo(task);
  }

  updateTodo(task) {
    this.todoService.updateTodo(task)
  }

}
