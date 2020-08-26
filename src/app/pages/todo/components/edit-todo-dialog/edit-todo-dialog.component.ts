import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Todo} from "../../../../models/todo.model";

@Component({
  selector: 'app-edit-todo-dialog',
  templateUrl: './edit-todo-dialog.component.html',
  styleUrls: ['./edit-todo-dialog.component.scss']
})
export class EditTodoDialogComponent {

  initialValue: Todo = Object.assign({}, this.data);
  constructor(public dialogRef: MatDialogRef<EditTodoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: Todo) {

  }

  onNoClick(): void {
    console.log(this.initialValue)
    this.dialogRef.close(this.initialValue);
  }
}
