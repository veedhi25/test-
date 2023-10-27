import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { FileUploaderPopUpSettings, FileUploaderPopupComponent } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { hCategoryMaster } from './hCategoryMaster';
import { CategoryList } from './CategoryList';
import { hcategorymasterService } from './hcategorymaster.service';

@Component(
  {
    selector: 'hcategorymaster',
    templateUrl: './hcategorymaster.component.html',

  }
)
export class hcategorymasterComponent implements OnInit
 {
    lstCategoryList:any[]=[];
    HCategMode:string=null;
    public lsthCategoryMaster:hCategoryMaster[]=[];
    public hCategoryMaster:hCategoryMaster=<hCategoryMaster>{};
    constructor(
        private alertService: AlertService,
        private _hcategorymasterService:hcategorymasterService
        ){}
    ngOnInit()
    {
        this.LoadHCategoryMaster();
        this.GetCategoryMasterList();
    }
    AddNewHCategory()
    {
        this.hCategoryMaster=<hCategoryMaster>{}
        this.HCategMode=null;
        this.HCategMode="Add";
    }
    LoadhCategoryById(CategoryId:number)
    {
        this.HCategMode="Edit";
        this._hcategorymasterService.GethCategoryMasterListById(CategoryId)
        .subscribe(
          data => 
          {
              if (data.status === "ok") 
              {
                  var tdata = data.data;
                  tdata = tdata ? tdata : [];
                  this.hCategoryMaster = tdata[0];
                  console.log("H Category Group Details ",this.hCategoryMaster);
              }
              else
              {
                  this.hCategoryMaster = <hCategoryMaster>{};
              }
          },
          error=>
          {
              alert(error.message);
          }
        );
    }
    LoadHCategoryMaster()
    {
        this._hcategorymasterService.GethCategoryMasterList()
      .subscribe(
        data => 
        {
            if (data.status === "ok") 
            {
                var tdata = data.data;
                tdata = tdata ? tdata : [];
                this.lsthCategoryMaster = tdata;
            }
            else
            {
                this.lsthCategoryMaster = [];
            }
        },
        error=>
        {
            alert(error.message);
        }
      );
    }
    GetCategoryMasterList()
    {
        this._hcategorymasterService.GethCategoryMasterList()
      .subscribe(
        data => 
        {
            console.log("Category List 1",data);
            if (data.status === "ok") 
            {
                var tdata = data.data;
                tdata = tdata ? tdata : [];
                this.lstCategoryList = tdata;
            }
            else
            {
                this.lstCategoryList = [];
            }
        },
        error=>
        {
            alert(error.message);
        }
      );
    }
    SaveItemGroup()
    {
        console.log(this.hCategoryMaster);
        this._hcategorymasterService.AddEditHCategory(this.hCategoryMaster)
        .subscribe(
        data=>
        {
            console.log(data);
            alert(data.result);
            if(data.status==="ok")
            {
                this.LoadHCategoryMaster();
                this.HCategMode=null;
            }
        }
        );
    }
    CloseModal()
    {
        this.HCategMode=null;
    }
 }