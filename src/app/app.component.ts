// import { Component } from '@angular/core';
// import { Task } from './task/task';
// import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
// import { MatDialog } from '@angular/material/dialog';
// import { TaskDialogResult, TaskDialogComponent } from './task-dialog/task-dialog.component';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent {
//   todo: Task[] = [
//     {
//       title: 'Buy milk',
//       description: 'Go to the store and buy milk',
//     },
//     {
//       title: 'Create a Kanban app',
//       description: 'Using Firebase and Angular create a Kanban app!',
//     },
//   ];
//   inProgress: Task[] = [];
//   done: Task[] = [];

//   constructor(private dialog: MatDialog) {}

//   newTask(): void {
//     const dialogRef = this.dialog.open(TaskDialogComponent, {
//       width: '270px',
//       data: {
//         task: {},
//       },
//     });
//     dialogRef
//       .afterClosed()
//       .subscribe((result: TaskDialogResult) => {
//         if (!result) {
//           return;
//         }
//         this.todo.push(result.task);
//       });
//   }

//   editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
//     const dialogRef = this.dialog.open(TaskDialogComponent, {
//       width: '270px',
//       data: {
//         task,
//         enableDelete: true,
//       },
//     });
//     dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
//       if (!result) {
//         return;
//       }
//       const dataList = this[list];
//       const taskIndex = dataList.indexOf(task);
//       if (result.delete) {
//         dataList.splice(taskIndex, 1);
//       } else {
//         dataList[taskIndex] = task;
//       }
//     });
//   }

//   drop(event: CdkDragDrop<Task[]>): void {
//     if (event.previousContainer === event.container) {
//       return;
//     }
//     transferArrayItem(
//       event.previousContainer.data,
//       event.container.data,
//       event.previousIndex,
//       event.currentIndex
//     );
//   }
// }

import { Component } from '@angular/core';
import { Task } from './task/task';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogResult, TaskDialogComponent } from './task-dialog/task-dialog.component';

import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';




const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todo = this.store.collection('todo').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  inProgress = this.store.collection('inProgress').valueChanges({ idField: 'id' }) as Observable<Task[]>;
  done = this.store.collection('done').valueChanges({ idField: 'id' }) as Observable<Task[]>;

  constructor(private dialog: MatDialog, private store: AngularFirestore) {}

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult) => {
        if (!result) {
          return;
        }
        this.store.collection('todo').add(result.task);
      });
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete();
      } else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]|null>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.previousContainer.data || !event.container.data) {
      return;
    }
    const item = event.previousContainer.data[event.previousIndex];
    this.store.firestore.runTransaction(() => {
      const promise = Promise.all([
        this.store.collection(event.previousContainer.id).doc(item.id).delete(),
        this.store.collection(event.container.id).add(item),
      ]);
      return promise;
    });
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}