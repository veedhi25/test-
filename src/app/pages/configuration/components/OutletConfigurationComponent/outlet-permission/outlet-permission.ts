
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MasterRepo } from '../../../../../common/repositories';
import { AlertService } from '../../../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../../../common/services/spinner/spinner.service';

@Component({
    selector: 'outlet-permission',
    templateUrl: './outlet-permission.html'
})

export class OutletPermission implements OnInit, OnChanges {
    @Input() targetCompanyId:string | undefined;
   permissionArray : any=[];
   
    
    constructor(private masterRepo: MasterRepo,private alertService :  AlertService,private spinnerService: SpinnerService) {

    }

    ngOnInit(){
        this.getOutletPermissionSetting();
    }

    ngOnChanges(){
        this.getOutletPermissionSetting();
    }

    getOutletPermissionSetting(){
        this.permissionArray=null;
        try {
            
            if(typeof this.targetCompanyId =='undefined' || this.targetCompanyId == null || this.targetCompanyId == '-1'){
                this.targetCompanyId='';
            }
            this.masterRepo.masterGetmethod(`/getOutletPermissionSetting?targetCompanyId=`+ this.targetCompanyId).subscribe(res=>{
                if(res.status=="ok"){                   
                        this.permissionArray =  res.result;
                }else{
                    this.alertService.error(res.message);
                    
                }
            })          
        } catch (ex) {
            this.alertService.error(ex);
        }
    }

    getTargetCompanyId(){
        if(typeof this.targetCompanyId =='undefined' || this.targetCompanyId == null){
            this.targetCompanyId='';
        }
        return this.targetCompanyId;
    }
    
    saveOutletPermissionSetting() {
        if(this.permissionArray.length<=0){
            this.alertService.error("Please select at least one outlet Permission to save setting.");
            return;
        }
        //this.permissionArray=this.permissionArray.filter(e=>e.CanUpdate==true);

        this.masterRepo.masterPostmethod_NEW("/saveoutletpermissionsettings", this.permissionArray).subscribe((res: any) => {
            if (res.status == "ok") {
                this.spinnerService.hide();
                this.alertService.success(res.message);
               // this.initialiseForm();
               this.getOutletPermissionSetting();
            }
        }, error => {
            this.spinnerService.hide();
            this.alertService.error(error.statusText);
        })
    }
    
}
