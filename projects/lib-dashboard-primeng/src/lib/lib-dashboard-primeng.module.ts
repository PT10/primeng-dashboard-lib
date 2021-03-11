import { NgModule } from '@angular/core';
import { LibDashboardPrimengComponent } from './lib-dashboard-primeng.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [LibDashboardPrimengComponent],
  imports: [
    BrowserModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule
  ],
  exports: [LibDashboardPrimengComponent]
})
export class LibDashboardPrimengModule { }
