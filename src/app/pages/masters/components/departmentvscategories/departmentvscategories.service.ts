
import { Injectable } from '@angular/core';
import { MasterRepo } from '../../../../common/repositories';
@Injectable()
export class DepartmentVsCategoryService {
    DepartmentVsCategoryObj: DepartmentVsCategory
    constructor(private masterService:MasterRepo) {
        this.onResetClicked();
    }



    onResetClicked = (): void => {
        this.DepartmentVsCategoryObj = <DepartmentVsCategory>{};
        this.DepartmentVsCategoryObj.MODE = "NEW";
        this.DepartmentVsCategoryObj.TITLE = "DepartmentVsCategory";
        this.DepartmentVsCategoryObj.CATLIST = [];
        this.addNewRow();
        this.DepartmentVsCategoryObj.SELECTEDINDEX = 0;
    }

    addNewRow = (): void => {
        let catlist: DepartmentVsCategoryList = <DepartmentVsCategoryList>{};
        catlist.VARIANT = this.getLatestCategory();
        this.DepartmentVsCategoryObj.CATLIST.push(catlist);
    
    }

    getLatestCategory = (): string => {

        let currentCatlist = [];
        this.DepartmentVsCategoryObj.CATLIST.forEach(x => {

            if (x.VARIANT) {
                currentCatlist.push(this.masterService.nullToZeroConverter(x.VARIANT.split('_')[1]));
            }
        })

        if (!currentCatlist.length) {
            return "CATEGORY_1";
        }
        return `CATEGORY_${Math.max(...currentCatlist) + 1}`



    }
}


export interface DepartmentVsCategory {
    TITLE: string;
    MODE: string;
    CATLIST: DepartmentVsCategoryList[];
    SELECTEDINDEX: number

}

export interface DepartmentVsCategoryList {
    VARIANTVALUES: any[];
    CATEGORYID: number;
    VARIANT: string;
    VARIANTNAME: string;
}