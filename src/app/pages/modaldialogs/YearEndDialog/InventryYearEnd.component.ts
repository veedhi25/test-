import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { AuthService } from '../../../common/services/permission/authService.service';
import { MasterRepo } from '../../../common/repositories/masterRepo.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../common/services/alert/alert.service';


@Component({
  selector: 'inventry-yearend-dialog',
  templateUrl: './InventryYearEnd.component.html',
  styleUrls: ['./yearEndDialog.css']

})
export class InventryYearEndDialog {
  constructor(public dialogref: MdDialogRef<InventryYearEndDialog>, private authSerice: AuthService, private masterService: MasterRepo,
    private spinnerService: SpinnerService, private router: Router, private alertService: AlertService) {

  }
  YesClick() {
    if (this.masterService.userSetting.ENABLEOFFLINESALE == 1) { return; }
    this.spinnerService.show("Processing...Please Wait...")
    this.masterService.masterGetmethod("/yearEndingInventory").subscribe((res) => {
      if (res.status == "ok") {
        this.authSerice.setSessionVariable("isIYE", 1);
        this.dialogref.close();
        this.alertService.success("The year end for inventory are done successfully...");
        setTimeout(() => {
          this.router.navigate(["login", { logout: 'logout' }]).then(() => {
            window.location.reload();
          });
        }, 5000);

      } else {
        this.spinnerService.hide();
        alert(res.result._body);
      }
    }, error => {
      this.spinnerService.hide();
      alert(JSON.parse(error._body));
    })

  }
  NoClick() {
    this.authSerice.setSessionVariable("isIYE", 2);
    this.dialogref.close();
  }
  offlinelineOK() {
    this.authSerice.setSessionVariable("isIYE", 2);
    this.dialogref.close();
  }

}