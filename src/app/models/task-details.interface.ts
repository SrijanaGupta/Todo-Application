//interface to have consistent variables and datatype for the dialog box data entry
export interface TaskFields {
    header: string;
    title: string;
    desc: string;
    attachment: any;
    attachmentDetails: any[];
    taskOwner: any[];
    taskState: string;
    creationDate: Date;
  }