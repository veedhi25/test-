import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { FileUploaderPopUpSettings, FileUploaderPopupComponent } from '../../../../common/popupLists/file-uploader/file-uploader-popup.component';
import { ItemGroupMaster } from './ItemGroupMaster';
import { ItemGroupMasterService } from './itemgroupmaster.service';
import { CategoryList } from './CategoryList';

@Component(
  {
    selector: 'itemgroupmaster',
    templateUrl: './itemgroupmaster.component.html',

  }
)
export class itemgroupmasterComponent implements OnInit
 {
    lstCategoryList:CategoryList[]=[];
    ItemgrpMode:string=null;
    public lstItemGroupMaster:ItemGroupMaster[]=[];
    public ItemGroupMaster:ItemGroupMaster=<ItemGroupMaster>{};
    constructor(
        private alertService: AlertService,
        private _ItemGroupService:ItemGroupMasterService
        ){}
    ngOnInit()
    {
        this.LoadItemGroup();
        this.GetCategoryMasterList();
    }
    AddNewItemGroup()
    {
        this.ItemgrpMode=null;
        this.ItemgrpMode="Add";
    }
    LoadItemGroupById(ItemGroupId:number)
    {
        this.ItemgrpMode="Edit";
        this._ItemGroupService.GetItemGroupMasterListById(ItemGroupId)
        .subscribe(
          data => 
          {
              if (data.status === "ok") 
              {
                  var tdata = data.data;
                  tdata = tdata ? tdata : [];
                  this.ItemGroupMaster = tdata[0];
                  console.log("Item Group Details ",this.ItemGroupMaster);
              }
              else
              {
                  this.ItemGroupMaster = <ItemGroupMaster>{};
              }
          },
          error=>
          {
              alert(error.message);
          }
        );
    }
    LoadItemGroup()
    {
        this._ItemGroupService.GetItemGroupMasterList()
      .subscribe(
        data => 
        {
            if (data.status === "ok") 
            {
                var tdata = data.data;
                tdata = tdata ? tdata : [];
                this.lstItemGroupMaster = tdata;
            }
            else
            {
                this.lstItemGroupMaster = [];
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
        this._ItemGroupService.GetCategoryMasterList()
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
        console.log(this.ItemGroupMaster);
        this._ItemGroupService.AddEditItemGroup(this.ItemGroupMaster)
        .subscribe(
        data=>
        {
            console.log(data);
            alert(data.result);
            if(data.status==="ok")
            {
                this.LoadItemGroup();
                this.ItemgrpMode=null;
            }
        }
        );
    }
    CloseModal()
    {
        this.ItemgrpMode=null;
    }
 }