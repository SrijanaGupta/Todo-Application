import { Component, OnInit } from '@angular/core';

//Drag-Drop Module import
import {
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { Board } from '../../models/board.model';

//Column model import
import { Column } from '../../models/column.model';

//Dialogbox Component import
import { AddTaskComponent } from '../../add-task/add-task.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  //Variable declarations
  taskDetails: any[] = [];
  inProgressDetails: any[] = [];
  testingDetails: any[] = [];
  doneDetails: any[] = [];
  jsonData: any;
  inProgresslist = new Column('In-Progress', []);
  testingList = new Column('Testing', []);
  doneList = new Column('Done', []);
  todolist = new Column('Todo', []);

  //Attempt on making the task board columns dynamic. But could not achieve it because of indiviual set of properties on each board column

  // board: Board = new Board('Test Board', [
  //   this.inProgresslist,
  //   this.testingList
  // ]);

  //event on Drop action of drag-drop feature
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.container.id === 'todo') {
        this.taskDetails = [...event.container.data];
        this.taskDetails.forEach((element) => {
          element.state = 'TODO';
        });
        this.inProgressDetails.forEach((element, index) => {
          for (let i = 0; i < event.container.data.length; i++) {
            if (element == event.container.data[i]) {
              this.inProgressDetails.splice(index, 1);
            }
          }
        });
        this.testingDetails.forEach((element, index) => {
          for (let i = 0; i < event.container.data.length; i++) {
            if (element == event.container.data[i]) {
              this.testingDetails.splice(index, 1);
            }
          }
        });
        //console.log([...this.taskDetails]);
        this.todolist.tasks = [...this.taskDetails];
      }

      if (event.container.id === 'inprogress') {
        this.inProgressDetails = [...event.container.data];
        this.inProgressDetails.forEach((element) => {
          element.state = 'IN-PROGRESS';
        });
        this.inProgresslist.tasks = [...this.inProgressDetails];
        //console.log('In-progress', this.inProgresslist.tasks);
        this.taskDetails.forEach((element, index) => {
          for (let i = 0; i < event.container.data.length; i++) {
            if (element == event.container.data[i]) {
              this.taskDetails.splice(index, 1);
            }
          }
        });
        this.todolist.tasks = [...this.taskDetails];
      }
      if (event.container.id === 'testing') {
        this.testingDetails = [...event.container.data];
        this.testingDetails.forEach((element) => {
          element.state = 'TESTING';
        });
        this.testingList.tasks = [...this.testingDetails];
        this.inProgressDetails.forEach((element, index) => {
          for (let i = 0; i < event.container.data.length; i++) {
            if (element == event.container.data[i]) {
              this.inProgressDetails.splice(index, 1);
            }
          }
        });
        this.inProgresslist.tasks = [...this.inProgressDetails];
      }
      if (event.container.id === 'done') {
        this.doneDetails = [...event.container.data];
        this.doneDetails.forEach((element) => {
          element.state = 'DONE';
        });
        this.doneList.tasks = [...this.doneDetails];
        this.testingDetails.forEach((element, index) => {
          for (let i = 0; i < event.container.data.length; i++) {
            if (element == event.container.data[i]) {
              this.testingDetails.splice(index, 1);
            }
          }
        });
        this.testingList.tasks = [...this.testingDetails];
      }

      // console.log('From - ',event.previousContainer.data[event.previousIndex])
    }
    this.localStorageafter();
  }

  //To create local storage at each and every change around board columns
  localStorageafter() {
    this.setLocalStorage('todo', this.taskDetails);
    this.setLocalStorage('in-progress', this.inProgressDetails);
    this.setLocalStorage('testing', this.testingDetails);
    this.setLocalStorage('done', this.doneDetails);
  }

  ngOnInit(): void {
    
    //getting the data from local storage
    if (JSON.parse(localStorage.getItem('todo')) != null) {
      var tododata = JSON.parse(localStorage.getItem('todo'));
      //console.log(tododata);
      this.taskDetails = tododata;
      this.todolist.tasks = [...this.taskDetails];
    }

    if (JSON.parse(localStorage.getItem('in-progress')) != null) {
      var inprogress = JSON.parse(localStorage.getItem('in-progress'));
      //console.log(inprogress);
      this.inProgressDetails = inprogress;
      this.inProgresslist.tasks = [...this.inProgressDetails];
    }

    if (JSON.parse(localStorage.getItem('testing')) != null) {
      var testing = JSON.parse(localStorage.getItem('testing'));
      //console.log(testing);
      this.testingDetails = testing;
      this.testingList.tasks = [...this.testingDetails];
    }

    if (JSON.parse(localStorage.getItem('done')) != null) {
      var done = JSON.parse(localStorage.getItem('done'));
      //console.log(done);
      this.doneDetails = done;
      this.doneList.tasks = [...this.doneDetails];
    }
  }

  //action on Add button present on the board bar
  addTask() {
    this.dialog
      .open(AddTaskComponent, {
        data: {
          header: 'Add Tasks',
          title: '',
          desc: '',
          attachment: 'Right',
          taskOwner: '',
          taskState: 'TODO',
          creationDate: Date(),
        },
        height: '510px',
        width: '400px',
        panelClass: 'dialogBoxStyle',
      })
      .afterClosed()
      .subscribe((result) => {
        this.taskDetails.push(...[result]);
        //console.log(this.taskDetails);
        this.todolist.tasks = [...this.taskDetails];
        this.setLocalStorage('todo', this.taskDetails);
      });
  }

  //action on Delete button click present on each task card(disabled for all other board columns except for TODO)
  onDelete(i) {
    var removed = this.taskDetails.splice(i, 1);
    console.log(removed[0]);
    this.todolist.tasks = [...this.taskDetails];
    this.localStorageafter();
  }

  //Sorting all the task cards based on the Title
  sortbyTitle() {
    this.localStorageafter();

    this.taskDetails.sort((a, b) =>
      a.title > b.title ? 1 : b.title > a.title ? -1 : 0
    );
    this.inProgressDetails.sort((a, b) =>
      a.title > b.title ? 1 : b.title > a.title ? -1 : 0
    );
    this.testingDetails.sort((a, b) =>
      a.title > b.title ? 1 : b.title > a.title ? -1 : 0
    );
    this.doneDetails.sort((a, b) =>
      a.title > b.title ? 1 : b.title > a.title ? -1 : 0
    );
    // [...[this.todolist.tasks]].sort((a, b) =>
    // a > b ? 1 : b > a ? -1 : 0)
    this.todolist.tasks = [...this.taskDetails];
    this.inProgresslist.tasks = [...this.inProgressDetails];
    this.testingList.tasks = [...this.testingDetails];
    this.doneList.tasks = [...this.doneDetails];
  }

  //Sorting all the task cards based on Creation Date
  sortbyDate() {
    this.localStorageafter();

    this.taskDetails.sort((a, b) => b.creationDate - a.creationDate);
    this.todolist.tasks = [...this.taskDetails];
    this.inProgressDetails.sort((a, b) => b.creationDate - a.creationDate);
    this.inProgresslist.tasks = [...this.inProgressDetails];
    this.testingDetails.sort((a, b) => b.creationDate - a.creationDate);
    this.testingList.tasks = [...this.testingDetails];
    this.doneDetails.sort((a, b) => b.creationDate - a.creationDate);
    this.doneList.tasks = [...this.doneDetails];
  }

  //enter predicate for in-progress board column
  inProgressPredicate(item) {
    if (item.dropContainer.id === 'todo' || item.dropContainer.id === 'testing')
      return true;
    else return false;
  }

  //enter predicate for testing board column
  inTestingPredicate(item) {
    if (item.dropContainer != undefined) {
      if (item.dropContainer.id === 'inprogress') return true;
      else return false;
    }
  }

  //enter predicate for done board column
  inDonePredicate(item) {
    if (item) {
      if (item.dropContainer.id === 'testing') return true;
      else return false;
    }
  }

  //creating a local storage for storing all the task card details
  setLocalStorage(key, jsonData) {
    localStorage.setItem(key, JSON.stringify(jsonData));
  }

  //action on Edit button click on each task card
  editTask(e, index) {
    console.log(e);
    console.log(index);
    this.dialog
      .open(AddTaskComponent, {
        data: {
          header: 'Edit Tasks',
          title: e.title,
          desc: e.description,
          attachment: e.attachments,
          attachmentDetails: e.filenames,
          taskOwner: e.ownernames,
          taskState: e.state,
          creationDate: e.creationDate,
        },
        height: '510px',
        width: '400px',
        panelClass: 'dialogBoxStyle',
      })
      .afterClosed()
      .subscribe((result) => {
        // console.log(`Dialog result: ${JSON.stringify(result)}`);
        var editedData = [result];
        //console.log(editedData[0].state);
        if (editedData[0].state === 'TODO') {
          this.taskDetails.forEach((element, i) => {
            if (i === index) this.taskDetails.splice(i, 1, editedData[0]);
          });
        }
        this.todolist.tasks = [...this.taskDetails];
        if (editedData[0].state === 'IN-PROGRESS') {
          this.inProgressDetails.forEach((element, i) => {
            if (i === index) this.inProgressDetails.splice(i, 1, editedData[0]);
          });
        }
        this.inProgresslist.tasks = [...this.inProgressDetails];
        if (editedData[0].state === 'TESTING') {
          this.testingDetails.forEach((element, i) => {
            if (i === index) this.testingDetails.splice(i, 1, editedData[0]);
          });
        }
        this.testingList.tasks = [...this.testingDetails];
      });
    this.localStorageafter();
  }
}
