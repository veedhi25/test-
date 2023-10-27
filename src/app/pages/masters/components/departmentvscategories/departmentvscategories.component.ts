import { Component, OnInit } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { DepartmentVsCategoryService } from './departmentvscategories.service';

@Component(
    {
        selector: 'departmentvscategories',
        templateUrl: './departmentvscategories.component.html',
        providers: [DepartmentVsCategoryService],
        styleUrls: ['./departmentvscategories.component.scss']
    }
)
export class DepartmentVsCategoryComponent implements OnInit {

    constructor(public _departmentvsCategory: DepartmentVsCategoryService, private _masterRepo: MasterRepo, private _spinnerService: SpinnerService, private _alertService: AlertService) {


    }

    ngOnInit() {
        this._masterRepo.masterPostmethod_NEW("/getcategorywiseconfiguration", {}).subscribe((res) => {
            if (res.status == "ok" && res.result.length) {
                this._departmentvsCategory.DepartmentVsCategoryObj.CATLIST = res.result;
            }
        }, error => {

        })
    }

    onCategoryNameEnterClicked = (index): void => {
        if (this._departmentvsCategory.DepartmentVsCategoryObj.CATLIST.some(x => x.VARIANTNAME == "" || x.VARIANTNAME == undefined || x.VARIANTNAME == null)) {
            return;
        }
        this._departmentvsCategory.addNewRow();
        this._departmentvsCategory.DepartmentVsCategoryObj.SELECTEDINDEX = index;
        setTimeout(() => {
            this._masterRepo.focusAnyControl("catname" + (this._masterRepo.nullToZeroConverter(index) + 1))
        }, 0);
    }


    onReset(){this._departmentvsCategory.onResetClicked(); this.ngOnInit();}


    onSaveClicked = (): void => {
        this._spinnerService.show("saving data.please wait.");
        const catlist = this._departmentvsCategory.DepartmentVsCategoryObj.CATLIST;
        catlist.forEach(x => {
            if (x.VARIANTVALUES == null) {
                x.VARIANTVALUES = [];
            } else {
                x.VARIANTVALUES = JSON.parse(x.VARIANTVALUES.toString())
            }
        })
        this._masterRepo.masterPostmethod_NEW("/savecategorywiseconfiguration", catlist.filter(x => x.VARIANTNAME)).subscribe((res) => {
            this._spinnerService.hide();
            this._alertService.success(res.result)
        }, error => {
            this._spinnerService.hide();
        })
    }
    deleteRow(index)
    {
        if(confirm("Are you sure you want to delete this category?"))
        {

this._masterRepo.masterGetmethod_NEW("/deletedepartmentvscategorymaster?id="+this._departmentvsCategory.DepartmentVsCategoryObj.CATLIST[index].VARIANT).subscribe(res=>
    {
        if(res.status=="ok")
        {
            this._alertService.success(res.result);
            this.onReset();
        }
    },error=>
    {
        this._alertService.error(error._body);
    });
        }
    }
}
