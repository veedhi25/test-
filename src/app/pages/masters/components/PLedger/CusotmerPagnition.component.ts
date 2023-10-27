import {
    Component,
    Input,
    Output,
    EventEmitter,
    Injector,
    HostListener,
    OnChanges,
    AfterViewInit,
    Pipe
} from "@angular/core";
import { first, map } from 'rxjs/operators';
import { PagedListingComponentBase } from "../../../../paged-list-component-base";

@Component({
    selector: "CusotmerPagnition",
    templateUrl: "./CusotmerPagnition.html",
})
export class CusotmerPagnition extends PagedListingComponentBase
    implements OnChanges {
    /** List Declaration  */

    requestUrl: string = "";

    isActive: boolean = false;
    itemList: any[] = [];
    selectedRowIndex: number = 0;
    tabindex: string = "list";
    /** Output  */

    @Output() onDeleteClicked = new EventEmitter();
    @Output() onConfirmClicked = new EventEmitter();
    @Output() onViewClicked = new EventEmitter();
    @Output() onEditClicked = new EventEmitter();

    /** Input  */

    @Input() popupsettings: IMSGridSettings;
    constructor(public injector: Injector) {
        super(injector);

    }


    getData() {

        this.selectedRowIndex = 0;
        let apiEndpoints = this.popupsettings.apiEndpoints;

        let apiUrl = `${this.apiUrl}${apiEndpoints}?currentPage=${this.pageNumber
            }&maxResultCount=${this.pageSize}`;


        let additionalParamQuery = '';
        if (this.popupsettings.AdditionalParam && this.popupsettings.AdditionalParam.length) {
            this.popupsettings.AdditionalParam.forEach(x => {
                additionalParamQuery = additionalParamQuery + `&${x.FilterKey}=${x.Value}`;
            });
            apiUrl = apiUrl + additionalParamQuery;
        }



        this.requestUrl = this.getFilterOption(apiUrl);

        let filteredParam = this.filter.filter(x => x.Value != null && x.Value != undefined && x.Value != "" && x.Value != "%");
        if (filteredParam.length > 0) {
            this.requestUrl = `${apiUrl}&filters=${JSON.stringify(filteredParam)}`
        } else {
            this.requestUrl = apiUrl;
        }



        return this._http
            .get(this.requestUrl)
           // .pipe(first())
            .subscribe(res => {
                this.totalItems = res ? res['totalCount'] : 0;
                this.itemList = res ? res['data'] : [];

                this.itemList.forEach(function (item) {
                    if (item.TRNDATE != null && item.TRNDATE != undefined) {
                        item.TRNDATE = item.TRNDATE.toString().substring(0, 10);
                    }
                    if (item.DATE != null && item.DATE != undefined) {
                        item.DATE = item.DATE.toString().substring(0, 10);
                    }
                });
                if (this.itemList[this.selectedRowIndex] != null) {
                    this.itemList[this.selectedRowIndex].itemSummary;
                }
            });
    }

    hide() {
        this.itemList = [];
        this.pageNumber = 1;
        this.totalItems = 0;
        this.isActive = false;
    }


    singleClick(index) {
        this.selectedRowIndex = index;
    }

    @HostListener("document : keydown", ["$event"])
    @debounce(10)
    updown($event: KeyboardEvent) {
        if (!this.isActive) return true;
        if ($event.code == "ArrowDown") {
            $event.preventDefault();
            this.selectedRowIndex++;
            this.calculateTotalPages();
            if (
                this.selectedRowIndex == this.itemList.length &&
                this.pageNumber < this.totalPages
            ) {
                this.pageNumber = this.pageNumber + 1;
                this.refresh();
                this.selectedRowIndex = 0;
            } else if (
                this.selectedRowIndex == this.itemList.length &&
                this.pageNumber == this.totalPages
            ) {
                this.selectedRowIndex = this.itemList.length - 1;
            }
        } else if ($event.code == "ArrowUp") {
            $event.preventDefault();
            this.selectedRowIndex--;
            if (this.selectedRowIndex == -1 && this.pageNumber > 1) {
                this.pageNumber = this.pageNumber - 1;
                this.refresh();
                this.selectedRowIndex = this.itemList.length - 1;
            } else if (this.selectedRowIndex == -1 && this.pageNumber == 1) {
                this.selectedRowIndex = 0;
            }
        } else if (
            ($event.code == "Enter" || $event.code == "NumpadEnter") &&
            this.selectedRowIndex >= 0 &&
            this.selectedRowIndex < this.itemList.length
        ) {
            $event.preventDefault();
        } else if ($event.code == "Escape") {
            $event.preventDefault();
            this.hide();
        } else if ($event.code == "ArrowRight") {
            $event.preventDefault();
            this.calculateTotalPages();
            if (this.pageNumber >= this.totalPages) {
                this.pageNumber = this.totalPages;
                return;
            }

            this.selectedRowIndex = 0;
            this.pageNumber = this.pageNumber + 1;
            this.refresh();
        } else if ($event.code == "ArrowLeft") {
            $event.preventDefault();
            if (this.pageNumber <= 1) {
                this.pageNumber = 1;
                return;
            }
            this.selectedRowIndex = 0;
            this.pageNumber = this.pageNumber - 1;
            this.refresh();

        }
    }





    public filter = <any>[];
    @debounce(10)
    onValueChange(event, value, Field) {
        if (this.filter.length > 0) {
            for (let x of this.filter) {
                let index = this.filter.findIndex(x => x.Field == Field);
                if (index > -1) {
                    this.filter[index].Value = value;
                    break;
                } else {
                    this.filter.push({ Field: Field, Value: value });
                    break;
                }
            }
        } else {
            this.filter.push({ Field: Field, Value: value });
        }

        let requestEndPoint = "";
        let filteredParam = this.filter.filter(x => x.Value != null && x.Value != undefined && x.Value != "" && x.Value != "%");
        let apiEndpoints = this.popupsettings.apiEndpoints;
        this.pageNumber = 1;
        let req = `${this.apiUrl}${apiEndpoints}?currentPage=${this.pageNumber}&maxResultCount=${this.pageSize}`;
        if (filteredParam.length > 0) {
            requestEndPoint = `${req}&filters=${JSON.stringify(filteredParam)}`
        } else {
            requestEndPoint = req;
        }



        let additionalParamQuery = '';
        if (this.popupsettings.AdditionalParam && this.popupsettings.AdditionalParam.length) {
            this.popupsettings.AdditionalParam.forEach(x => {
                additionalParamQuery = additionalParamQuery + `&${x.FilterKey}=${x.Value}`;
            });
            requestEndPoint = requestEndPoint + additionalParamQuery;
        }





        return this._http
            .get(requestEndPoint)
           // .pipe(first())
            .subscribe(res => {
                this.totalItems = res ? res['totalCount'] : 0;
                this.itemList = res ? res['data'] : [];

                this.itemList.forEach(function (item) {
                    if (item.TRNDATE != null && item.TRNDATE != undefined) {
                        item.TRNDATE = item.TRNDATE.toString().substring(0, 10);
                    }
                    if (item.DATE != null && item.DATE != undefined) {
                        item.DATE = item.DATE.toString().substring(0, 10);
                    }
                });
            }, error => {
            });
    }


    ngOnChanges(changes: any) {
        this.popupsettings = changes.popupsettings.currentValue;
        setTimeout(() => {
            this.itemList = [];
            this.isActive = true;
            this.selectedRowIndex = 0;
            this.pageSize = this.popupsettings.pageSize ? this.popupsettings.pageSize : this.pageSize;
            this.refreshPage();
            this.refresh();
        }, 10);
    }


    onActionClicked(action: ActionKeyMaster, index: number, actionData: ActionKeySettings) {
        if (action == null || action == undefined) {
            return;
        } else {
            switch (action) {
                case ActionKeyMaster.DELETE:
                    if (confirm(`Are you sure to ${actionData.text}?.`)) {
                        this.onDeleteClicked.emit({ data: this.itemList[index], mode: ActionKeyMaster.DELETE });
                    }
                    break;
                case ActionKeyMaster.CONFIRM:
                    if (confirm(`Are you sure to ${actionData.text}?.`)) {
                        this.onConfirmClicked.emit({ data: this.itemList[index], mode: ActionKeyMaster.CONFIRM });
                    }
                    break;
                case ActionKeyMaster.VIEW:
                    this.onViewClicked.emit({ data: this.itemList[index], mode: ActionKeyMaster.VIEW })
                    break;
                case ActionKeyMaster.EDIT:
                    this.onEditClicked.emit({ data: this.itemList[index], mode: ActionKeyMaster.EDIT })
                    break;
                default:
                    break;
            }
        }
    }


    getPreparedValue(item: ColumnSettings, key) {
        if (typeof item.valuePrepareFunction === "function") {
            return item.valuePrepareFunction(key)
        } else {
            return key;
        }
    }
}

export class IMSGridSettings {
    title?: string;
    apiEndpoints?: string;
    columns?: ColumnSettings[] = [];
    pageSize?: number = 0;
    showActionButton?: boolean = false;
    actionKeys?: ActionKeySettings[] = [];
    AdditionalParam?: IMSGridParams[] = [];
}

export class ColumnSettings {
    key?: string;
    width?: string;
    title?: string;
    hidden?: boolean = false;
    noSearch?: boolean = false;
    type?: string = "string";
    valuePrepareFunction?: Function;
    filter?: {
        list?: FilterList[]
    }
}
export class ActionKeySettings {
    icon?: string = "";
    text?: string = "";
    title?: string = "";
    type?: ActionKeyMaster;

}

export class FilterList {
    value: string | number;
    title: string;
}


export interface IMSGridParams {
    FilterKey: string;
    Value: string;
}

export enum ActionKeyMaster {
    VIEW = "VIEW",
    DELETE = "DELETE",
    EDIT = "EDIT",
    CONFIRM = "CONFIRM"
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