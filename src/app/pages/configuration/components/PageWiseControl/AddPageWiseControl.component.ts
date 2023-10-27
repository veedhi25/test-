import { Component, ViewChild, OnInit } from "@angular/core";
import { MasterRepo } from "../../../../common/repositories";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GenericPopUpSettings, GenericPopUpComponent } from '../../../../common/popupLists/generic-grid/generic-popup-grid.component';
import { AlertService } from '../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../common/services/spinner/spinner.service';
import { ModalDirective } from 'ng2-bootstrap';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: "PageWiseControl",
  templateUrl: "./AddPageWiseControl.component.html",

})
export class AddPageWiseControlComponent implements OnInit {
  

  gateId:string="";
  mode: string = "add";
  public showBardiv:boolean = false;
  isShown: boolean = true ; 
  isShownupdate: boolean = false ; 
  isShownback:boolean = true ; 
  loading: boolean;
   myDisableStatus:boolean;
  isReadonly = true;
  ModeId:number = 0;
  LocationId:string ="";
  public pageName: string;
  public controlName: string;
  public ControlType: string ="0";



  public accessControlPermissionList: any[];  
  public accessControlPermissionListFilter: any[];  

  currentRoute: string;

  constructor(private masterService: MasterRepo, private fb: FormBuilder, 
    private alertService: AlertService, private router: Router, private _activatedRoute: ActivatedRoute,public dialog: MdDialog, private loadingService: SpinnerService) {
  
  this.mode = this._activatedRoute.snapshot.params["mode"];
  this.gateId = this._activatedRoute.snapshot.params["passId"];
  this.currentRoute = router.url;
  this.get();
  }

  get()
  {
    this.masterService.getPageWiseAccess(this.currentRoute,0,0).subscribe(data => {
       this.accessControlPermissionList = data.lstData;
       this.accessControlPermissionListFilter = data.lstData;
      });
  }
 
  ngOnInit() {

    try {
      

      if (this.mode == "edit") {
        
        this.masterService.getPageWiseControlDetail(this.gateId).subscribe(data => {
       
        this.pageName=  data[0].PageName,
        this.controlName = data[0].ControlText,
        this.ControlType = data[0].ControlType,
     
        this.ModeId = 1;
        this.gateId = data[0].PageWiseId;
       
        this.isShownupdate = true;
        this.isShown = false;
        this.isShownback = true;

        });

      }
      if(this.mode == "view")
      {
        this.masterService.getPageWiseControlDetail(this.gateId).subscribe(data => {
        
          this.pageName=  data[0].PageName,
        this.controlName = data[0].ControlText,
        this.ControlType = data[0].ControlType,
       
        this.isShownupdate = false;
        this.isShown = false;
        this.isShownback = true;

        
        });
       
      }

   
       

  } catch (ex) {
      this.alertService.error(ex);
  }

  }
 

onSaveClicked() {
  try {
    var errorList = "";

    
      if(this.pageName == null || this.pageName == "")
          errorList +="Enter Page Name. \n";
      if(this.controlName == null || this.controlName == "")
          errorList +="Enter Control Name. \n";
      if(this.ControlType == null || this.ControlType == ""|| this.ControlType == "0")
          errorList +="Enter Control Type. \n";
         
        if(errorList.length > 0)
        {
        this.alertService.error(errorList);
        return;
        }
        else
        {
          var requestObject = JSON.stringify({
            "Mode":0,
            "PageWiseId":0,
            "PageName": this.pageName,
            "ControlText": this.controlName,
            "ControlType": this.ControlType,
          
          });
         
          this.masterService.saveRecordPageWiseControl(requestObject).subscribe(res => {
          
            if(res.result == 'Control Name Already exists for this Page')
            {
             
              this.alertService.warning(res.result);
            
            }
            else if(res.result == 'Add Record Successfully'
            || res.result == 'Update Data Successfully')
            {
              this.alertService.success(res.result);
              this.clearText();
            }
            else
            {
           
              this.alertService.error(res.result);
            }
          });
        }
  }
  catch (e) {
    
      this.alertService.error(e);
  }
}

onBackClick(): void {
  try {
    this.router.navigate([
      "pages/configuration/settings/PageWiseControl",
    ]);
  } catch (ex) {
    alert(ex);
  }
}

onUpdateClicked() {
  try {
    var errorList = "";

    
    if(this.pageName == null || this.pageName == "")
    errorList +="Enter Page Name. \n";
if(this.controlName == null || this.controlName == "")
    errorList +="Enter Control Name. \n";
if(this.ControlType == null || this.ControlType == "" || this.ControlType == "0")
    errorList +="Enter Control Type. \n";
        if(errorList.length > 0)
        {
        this.alertService.error(errorList);
        return;
        }
        else
        {
          var requestObject = JSON.stringify({
            "Mode":1,
            "PageWiseId":this.gateId,
            "PageName": this.pageName,
            "ControlText": this.controlName,
            "ControlType": this.ControlType
          });
          this.masterService.saveRecordPageWiseControl(requestObject).subscribe(res => {

            if(res.result == 'Control Name Already exists for this Page')
                this.alertService.error(res.result);
            else
            {
              this.alertService.error(res.result);
              this.clearText();
            }
          });
        }
  }
  catch (e) {
    
      this.alertService.error(e);
  }
}

clearText()
{
  this.pageName="";
  this.controlName="";
  this.ControlType="";
  this.gateId="";
  
this.isShownupdate = false;
this.isShownback = true;
}

check(item){
  let _searchText = item;
 
if(this.accessControlPermissionListFilter !=undefined)
{

  this.accessControlPermissionList =  this.accessControlPermissionListFilter;

   if(_searchText !='')
   {
     //this.accessControlPermissionList =this.accessControlPermissionList.filter(x => x.ControlText.toLowerCase().includes(_searchText.toLowerCase()) );
     this.accessControlPermissionList =this.accessControlPermissionList.filter(x => x.ControlText.toLowerCase()===_searchText.toLowerCase());
     if(this.accessControlPermissionList.length > 0)
     {
        return false;
     }
     else
     {

      if(_searchText.toLowerCase() == "update")
      {
          if(this.isShownupdate == false)
          {
            this.isShown = true;
            this.isShownupdate = false;
            return false;
           
          }
          else
          {
            this.isShown = false;
            this.isShownupdate = true;
            return true;
          }
      }
      else if(_searchText.toLowerCase() == "save")
      {
          if(this.isShown == false)
          {
            this.isShown = false;
            this.isShownupdate = true;
            return false;
           
          }
          else
          {
            this.isShown = true;
            this.isShownupdate = false;
            return true;
          }
      }
      else
      {
        return true;
      }
        
     }
   }
   
  }
  else
  {
    if(_searchText.toLowerCase() == "update")
    {
        if(this.isShownupdate == false)
        {
          this.isShown = true;
          this.isShownupdate = false;
          return false;
         
        }
        else
        {
          this.isShown = false;
          this.isShownupdate = true;
          return true;
        }
    }
    else if(_searchText.toLowerCase() == "save")
    {
        if(this.isShown == false)
        {
          this.isShown = false;
          this.isShownupdate = true;
          return false;
         
        }
        else
        {
          this.isShown = true;
          this.isShownupdate = false;
          return true;
        }
    }
    else
    {
      return true;
    }
  }

}

counter(i: number) {
  return new Array(i);
}


}
