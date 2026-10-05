import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TodoService } from '../../core/services/todo.service';
import { Todo } from '../../models/todo.model';
import { EditTodoDialogComponent } from './components/edit-todo-dialog/edit-todo-dialog.component';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  datasource = new MatTableDataSource<Todo>([]);
  loading = false;
  saving = false;
  error = '';
  todoForm: FormGroup;
  columnDefs = ['done', 'id', 'description', 'remove'];
  private destroyed = new Subject<void>();

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.datasource.paginator = paginator;
  }
  @ViewChild(MatSort) set matSort(sort: MatSort) { this.datasource.sort = sort; }

  constructor(private todoService: TodoService, private fb: FormBuilder, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({ task: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(500)]] });
    this.loading = true;
    this.todoService.getTodos().pipe(takeUntil(this.destroyed)).subscribe(todos => {
      this.todos = todos;
      this.datasource.data = todos;
      this.loading = false;
    }, () => {
      this.loading = false;
      this.error = 'Tasks could not be loaded. Please reload to retry.';
    });
  }

  get f() { return this.todoForm.controls; }

  private async write(action: () => Promise<void>): Promise<boolean> {
    if (this.saving) { return false; }
    this.saving = true;
    this.error = '';
    try {
      await action();
      return true;
    } catch {
      this.error = 'The change could not be saved. Your input has been kept; please retry.';
      return false;
    } finally {
      this.saving = false;
    }
  }

  async addNewTodo(): Promise<void> {
    if (this.todoForm.invalid || this.saving) { return; }
    const description = this.todoForm.value.task.trim();
    if (await this.write(() => this.todoService.createTodo({ description, isComplete: false }))) {
      this.todoForm.reset({ task: '' });
    }
  }

  editTodo(task: Todo): void {
    const ref = this.dialog.open(EditTodoDialogComponent, { width: '500px', data: { ...task } });
    ref.afterClosed().pipe(takeUntil(this.destroyed)).subscribe((result: Todo | undefined) => {
      if (result) { this.updateTodo(result); }
    });
  }

  async deleteTodo(id: string): Promise<void> {
    await this.write(() => this.todoService.deleteTodo(id));
  }

  async updateTodo(task: Todo): Promise<void> {
    if (!(await this.write(() => this.todoService.updateTodo(task)))) { this.editTodo(task); }
  }

  async toggleTodo(task: Todo, isComplete: boolean): Promise<void> {
    await this.write(() => this.todoService.updateTodo({ ...task, isComplete }));
    // Re-render authoritative snapshot data after a failed write as well.
    this.datasource.data = [...this.todos];
  }

  ngOnDestroy(): void { this.destroyed.next(); this.destroyed.complete(); }
}
