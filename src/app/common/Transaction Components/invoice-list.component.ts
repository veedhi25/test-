import { Component, OnInit, Output, EventEmitter, Input, Injector, OnChanges, HostListener } from "@angular/core";
import { TransactionService } from "./transaction.service";
import { PagedListingComponentBase } from "../../paged-list-component-base";
@Component({
    selector: "invoice-list",
    templateUrl: "./invoice-list.component.html",
    styleUrls: ["../../pages/Style.css", "./_theming.scss"]
})
export class InvoiceListComponent extends PagedListingComponentBase implements OnInit, OnChanges {

    public itemList: any[] = [];
    public tabindex: string = "list";
    public keys: any[] = [];
    @Input() source: any = <any>{};
    @Input() header: any[] = [];
    @Output() pageChange: EventEmitter<any> = new EventEmitter<any>()
    constructor(public injector: Injector, public _transactionService: TransactionService) {
        super(injector);

    }

    ngOnInit() {
        
        this.itemList = this.source.data;
        if (this.source.data) {
            
        }
        this.totalItems = this.source.totalCount;
        this.getKyes(this.itemList);
    }
    ngOnChanges(current: any): void {
        this.source.data = current.source.currentValue.data;
        this.totalItems = current.source.currentValue.totalCount;
        this.getKyes(this.source.data);
    }

    getKyes(datasource: any[]) {
        if (datasource.length) {
            if (datasource[0].INDENTNO != undefined) {
                this.keys = ["INDENTNO", "TRNDATE", "APPROVED", "DELIVERED"];
            }
            else {
                this.keys = Object.keys(datasource[0]);
            }

            
        }
    }
    onPageChange(value) {
        this.pageNumber = value ? value : 1;
        this.pageChange.emit(this.pageNumber)
    }

    getData() {
    }



    onSelectAll(event) {
        if (event.target.checked) {
            this.source.data.forEach(x => x.isChecked = true);
        } else {
            this.source.data.forEach(x => x.isChecked = false);

        }
    }

    @HostListener("document : keydown", ["$event"])
    @debounce(10)
    updown($event: KeyboardEvent) {
        if ($event.code == "ArrowRight") {
            $event.preventDefault();
            this.calculateTotalPages();
            if (this.pageNumber >= this.totalPages) {
                this.pageNumber = this.totalPages;
                return;
            }
            this.pageNumber = this.pageNumber + 1;
            this.onPageChange(this.pageNumber)
        } else if ($event.code == "ArrowLeft") {
            $event.preventDefault();
            if (this.pageNumber <= 1) {
                this.pageNumber = 1;
                return;
            }
            this.pageNumber = this.pageNumber - 1;
            this.onPageChange(this.pageNumber)

        }
    }

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