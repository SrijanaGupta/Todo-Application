import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskFields } from '../models/task-details.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  //variable declaration
  noOfAttachments: any;
  noOfOwners: any;
  title: string;
  details: {};
  ownerList: any[] = [
    'John Aden',
    'Phillip Johnson',
    'Patrick Robert',
    'Sam Morisson',
    'Deboy Maden',
  ];
  fileNames: any[] = [];
  desc: any;
  owners: any[] = [];
  ownerArray: any[] = [];
  totalAttachments: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskFields
  ) {}

  ngOnInit(): void {
  }

  //to fetch the input title
  enteredTitle(title) {
    this.title = title.target.value;
  }

  //to fetch the input description
  enteredDesc(desc) {
    this.desc = desc.target.value;
  }

  //to fetch the input files
  selectFile(file) {
    const files = file.target.files;
    for (let i = 0; i < files.length; i++) {
      if (this.fileNames.length > 0) {
        this.fileNames.forEach((element) => {
          if ((element! = files[i].name)) {
            this.fileNames.push(files[i].name);
          }
        });
      } else if (this.fileNames.length == 0) {
        this.fileNames.push(files[i].name);
      }
    }
    this.noOfAttachments = file.target.files.length;
  }

  //to fetch the list of selected owners
  selectedOwners(owner) {
    this.owners.push(...owner.value);
  }

  //action on Add/Update Button click present on the Dialog
  close() {
    for (let i = 0; i < this.owners.length; i++) {
      if (this.ownerArray.indexOf(this.owners[i]) === -1) {
        this.ownerArray.push(this.owners[i]);
      }
    }
    this.noOfOwners = this.ownerArray.length;
    if (this.data.attachmentDetails != undefined)
      this.totalAttachments = [
        ...this.data.attachmentDetails,
        ...this.fileNames,
      ];
    else this.totalAttachments = this.fileNames;
    //console.log(this.totalAttachments);
    this.details = {
      title: this.title ? this.title : this.data.title,
      attachments: this.totalAttachments.length,
      owners: this.noOfOwners ? this.noOfOwners : this.data.taskOwner.length,
      description: this.desc ? this.desc : this.data.desc,
      filenames: this.fileNames ? this.fileNames : this.totalAttachments,
      ownernames: this.ownerArray ? this.ownerArray : this.data.taskOwner,
      creationDate: this.data.creationDate,
      state: this.data.taskState,
    };
    //console.log(this.details);
    this.dialogRef.close(this.details);
  }
}
