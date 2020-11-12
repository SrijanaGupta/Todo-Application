import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './manager/tasks/tasks.component';

const routes: Routes = [
  {path:'',component:TasksComponent} //to redirect the page root to TaskComponent(instead of the default app component)
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
