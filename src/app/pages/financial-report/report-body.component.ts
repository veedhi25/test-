import { Component, Input, OnChanges, HostListener } from "@angular/core";
@Component({
    selector: "report-body",
    templateUrl: "./report-body.component.html",
})
export class ReportBodyComponent implements OnChanges {

    public tabindex: string = "list"
    @Input() particularsRow: any
    @Input() ACNAME: string
    @Input() DATE1: string
    @Input() DATE2: string
    @Input() totalRow: any
    @Input() listSetting: GenericReportListSettings;
    @Input() reportType:string
    @Input() voucherName:string
    public dataList: any
    public dataListTotal: any
    public selectedRowIndex = 0
    constructor() {

    }
    ngOnChanges(changes: any) {
        
        if(changes.reportType){
            this.reportType = changes.reportType.currentValue
        }
       
        if (changes.listSetting) {
            this.listSetting = changes.listSetting.currentValue;
        }
        if (changes.particularsRow) {
            this.dataList = changes.particularsRow.currentValue
        }
        if (changes.totalRow) {
            this.dataListTotal = changes.totalRow.currentValue
        }
        if (changes.ACNAME) {
            this.ACNAME = changes.ACNAME.currentValue
        }
        if (changes.DATE1) {
            this.DATE1 = changes.DATE1.currentValue
        }
        if (changes.DATE2) {
            this.DATE2 = changes.DATE2.currentValue
        }
        if( changes.voucherName){
            this.voucherName = changes.voucherName.currentValue
        }

    }



    @HostListener("document : keydown", ["$event"])
    @debounce(10)
    updown($event: KeyboardEvent) {
        if ($event.code == "ArrowDown") {
            $event.preventDefault();
            this.selectedRowIndex++;
            if (this.selectedRowIndex == this.dataList.length) {
                this.selectedRowIndex = this.dataList.length - 1;
            }
        } else if ($event.code == "ArrowUp") {
            $event.preventDefault();
            this.selectedRowIndex--;
            if (this.selectedRowIndex == -1) {
                this.selectedRowIndex = 0;
            }
        } else if (
            $event.ctrlKey && $event.code == "Enter" &&
            this.selectedRowIndex >= 0 &&
            this.selectedRowIndex < this.dataList.length
        ) {
            $event.preventDefault();
            if (document.getElementById('row' + this.selectedRowIndex).innerHTML != "") {
                document.getElementById('row' + this.selectedRowIndex).innerHTML = ""
            } else {
                document.getElementById('row' + this.selectedRowIndex).innerHTML = "This is sample text for testing"
            }
        }else if ($event.code == "Enter" && this.selectedRowIndex >= 0 && this.selectedRowIndex < this.dataList.length){
            $event.preventDefault()
            
        }
    }
}

export class GenericReportListSettings {
    title: string;
    columns: ColumnSettings[] = [];
}

export class ColumnSettings {
    key: string;
    title: string;
}

export function debounce(delay: number): MethodDecorator {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {

        const original = descriptor.value;
        const key = `__timeout__${propertyKey}`;

        descriptor.value = function (...args) {
            clearTimeout(this[key]);
            this[key] = setTimeout(() => original.apply(this, args), delay);
        };

        return descriptor;
    };
}