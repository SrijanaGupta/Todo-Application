//Attempt on making the task board columns dynamic. But could not achieve it because of indiviual set of properties on each board column
import { Column } from "./column.model";

export class Board{

    constructor(public name:String, public columns:Column[]){}
}