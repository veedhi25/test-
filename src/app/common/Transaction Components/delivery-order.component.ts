import { Component, Output, EventEmitter, Input } from "@angular/core";
import { TransactionService } from "./transaction.service";
import * as moment from 'moment'
import { MasterRepo } from "../repositories";

@Component({
    selector: "delivery-order",
    templateUrl: "./delivery-order.component.html",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class DeliveryOrderComponent {
    postatus: string = "0";
    indentstatus: string = "0";
    @Output() postatusemit: EventEmitter<any> = new EventEmitter<any>();
    @Output() indentstatusemit: EventEmitter<any> = new EventEmitter<any>();
    @Input() title: string = "";
    @Output() advanceSearchEmiter: EventEmitter<any> = new EventEmitter<any>();
    @Output() dateRangeChange: EventEmitter<any> = new EventEmitter<any>();
    selectedDate: { startDate: moment.Moment, endDate: moment.Moment };
    alwaysShowCalendars: boolean = true;

    locale = {
        format: 'DD/MM/YYYY',
        direction: 'ltr', // could be rtl
        weekLabel: 'W',
        separator: ' - ', // default is ' - '
        cancelLabel: 'Cancel', // detault is 'Cancel'
        applyLabel: 'Okay', // detault is 'Apply'
        clearLabel: 'Clear', // detault is 'Clear'
        customRangeLabel: 'Custom Range',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.monthsShort(),
        firstDay: 0 // first day is monday
    }

    constructor(public _transactionService: TransactionService, public masterService: MasterRepo) {
        this.selectedDate = {
            startDate: moment(),
            endDate: moment()
        }
    }

    advanceSearch() {
        this.advanceSearchEmiter.emit(true)
    }

    dateChanged(date) {
        this._transactionService.FilterObj.from = moment(this.selectedDate.startDate).format('YYYY-MM-DD HH:mm:ss')
        this._transactionService.FilterObj.to = moment(this.selectedDate.endDate).format('YYYY-MM-DD HH:mm:ss')
        this.dateRangeChange.emit(this.selectedDate)
    }

    undeliverpostatus() {
        this.postatusemit.emit(this.postatus);
    }
    undeliverindentstatus() {
        this.indentstatusemit.emit(this.indentstatus);
    }


}
