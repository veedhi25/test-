import { ScheduleService } from './schedule.service';
import { Component } from '@angular/core';
import 'style-loader!./smartTables.scss';
import { Router } from '@angular/router';
import { MdDialog } from "@angular/material";
import { Schedule } from '../../../common/interfaces/Schedule.interface';
import { MasterRepo } from '../../../common/repositories';
@Component({
  selector: 'tableSchedule',
  templateUrl: './tableSchedule.component.html',
  providers: [ScheduleService],
})
export class TabelComponent {

  filter: any;
  isLoader = true;
  currentPage = 1;
  itemspPerPage = 30;
  scheduleLists: any[] = [];
  totalCount: number;

  constructor(protected service: ScheduleService, private router: Router, public dialog: MdDialog, private masterService: MasterRepo) {
    try {

      this.masterService.getAllSchedule().subscribe(res => {
        this.scheduleLists = res;
      }, error => {

      }

      );
    } catch (ex) {
      alert(ex);
    }
  }

  addSchedule() {
    try {
      this.router.navigate(['./pages/configuration/scheme/scheduleTable/add-schedule', { mode: 'add', returnUrl: this.router.url }])
    }
    catch (ex) { }
  }


  addNewAccount() {
    try {
      this.router.navigate(["/pages/configuration/schedule", { mode: "add", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }
  onEditClick(event): void {
    try {
      this.router.navigate(["./pages/configuration/scheme/scheduleTable/add-schedule", { initial: event.DisID, mode: "edit", returnUrl: this.router.url }]);
    } catch (ex) {
      alert(ex);
    }
  }

  onViewClick(event): void {
    try {
      this.router.navigate(["./pages/configuration/scheme/scheduleTable/add-schedule", { initial: event.DisID, mode: "view", returnUrl: this.router.url }]);

    } catch (ex) {
      alert(ex);
    }
  }


  schedulePagination(event) {
    this.isLoader = true;
    this.currentPage = event;
    const t = this;
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      t.isLoader = false;
    }, 500);
  }

}