import { NgModule } from '@angular/core';
import { LibDashboardPrimengComponent } from './lib-dashboard-primeng.component';
import { TableModule } from 'primeng/table';
import { BrowserModule } from '@angular/platform-browser'



@NgModule({
  declarations: [LibDashboardPrimengComponent],
  imports: [
    BrowserModule,
    TableModule
  ],
  exports: [LibDashboardPrimengComponent]
})
export class LibDashboardPrimengModule { }
