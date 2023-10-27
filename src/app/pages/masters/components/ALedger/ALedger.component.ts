import { Observable } from "rxjs/Observable";
import { MdDialog } from "@angular/material";
import { MessageDialog } from "./../../../modaldialogs/messageDialog/messageDialog.component";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { ModalDirective } from "ng2-bootstrap";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  AcListTree,
  TAcList
} from "../../../../common/interfaces/Account.interface";
import { AuthService } from "../../../../common/services/permission";

import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PLedgerservice } from "../PLedger/PLedger.service";
import { AccountGroupPopUpComponent } from "../../../../common/popupLists/AGroupPopup/account-group-popup-grid.component";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";

@Component({
  selector: "ALedger",
  templateUrl: "ALedger.html",
  providers: [PLedgerservice, TransactionService],
  styleUrls: ["../../../Style.css", "../../../../common/popupLists/pStyle.css"]
})
export class ALedgerComponent {
  @ViewChild("acPopupGrid") acPopupGrid: AccountGroupPopUpComponent;
  @Output("onClose") onClose = new EventEmitter();
  ACID: string;
  @Input() rootID: string;
  @Input() mode: string;
  @Input() grp: string; 
  @Output() SavePartyEmit = new EventEmitter();
  @ViewChild("showParty") sParty: ElementRef;

  showAssets = 0;
  PARENTNAME = new FormControl('')
  selectednode: any;
  parentid: any;
  majorparent: any;
  majorParentAcList: any[] = [];
  acParentList: any[] = [];
  PARENTACNAME: string;
  RootName: string;
  acListtree: AcListTree = <AcListTree>{};
  ledgerAcObj: TAcList = <TAcList>{};
  ledgerAcList: TAcList[];
  private returnUrl: string;
  router: Router;
  form: FormGroup;
  viewMode = false;
  DialogMessage: string = "Saving data please wait ...";
  private subcriptions: Array<Subscription> = [];
  initialTextReadOnly = false;
  ID: string = "";
  modeTitle: string;
  // parentGroup: GroupParty;
  acGroups: any[] = [];
  dialogMessageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  dialogMessage$: Observable<string> = this.dialogMessageSubject.asObservable();
  actype: string = "";
  disableActype: boolean = false;
  lastParentID: string;
  userProfile: any;
  formObj: any = <any>{};
  Title: string = "";
  PType: string;
  isGroup: number;
  AccCurrentSelectedGroup: any;
  editItem: any;

  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    protected MasterService: MasterRepo,
    router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MdDialog,
    private _authService: AuthService
  ) {
    this.router = router;
    this.userProfile = this._authService.getUserProfile();
   this.showAssets = 0;
  }
  ngAfterViewInit() {
    console.log("CheckPtype", this.isGroup);
  }
  ngOnInit() {
    this.form = this._fb.group({
      PARENT: [""],
      ACCODE: [""],
      ACNAME: [""],
      ISACTIVE: [1],
      HASSUBLEDGER: [0],
      ACTYPE: [""],
      DIV: [""],
      MAPID: [""],
      TYPE:[""],
      ACID:[""]
    });
    this.onFormChanges();
    if (!!this._activatedRoute.snapshot.params["mode"])
      this.mode = this._activatedRoute.snapshot.params["mode"];

    if (!!this._activatedRoute.snapshot.params["isGroup"])
      this.isGroup = this._activatedRoute.snapshot.params["isGroup"];

      if (!!this._activatedRoute.snapshot.params["PType"])
      this.PType = this._activatedRoute.snapshot.params["PType"];

      this.form.patchValue({
        TYPE:this.PType

      })
  
    if (!!this._activatedRoute.snapshot.params["Title"])
      this.Title = this._activatedRoute.snapshot.params["Title"];

    if (!!this._activatedRoute.snapshot.params["ACID"])
      this.ACID = this._activatedRoute.snapshot.params["ACID"];

    if (!!this._activatedRoute.snapshot.params["returnUrl"])
      this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];
      if (!!this._activatedRoute.snapshot.params["PType"])
     this.PType = this._activatedRoute.snapshot.params["PType"];

     this.form.patchValue({
       TYPE:this.PType

     })

    if (this.mode == "edit") {
      //this.form.get("PARENT").disable();
    //  this.form.get("ACCODE").disable();
      //this.form.get("ACNAME").disable();
      //this.form.get("HASSUBLEDGER").disable();
     // this.form.get("ACTYPE").disable();
     // this.form.get("DIV").disable();
     // this.form.get("MAPID").disable();

      this.loadingService.show("Getting data, Please wait...");
      this.MasterService.getAllAccount(this.ACID).subscribe(
        data => {
          this.loadingService.hide();
          this.editItem = data.result;
          this.PARENTNAME.patchValue(data.result.GROUPNAME)
          this.form.patchValue({
            HASSUBLEDGER: data.result.HASSUBLEDGER,
            PARENT: data.result.PARENT,
            ACCODE: data.result.ACCODE,
            ACNAME: data.result.ACNAME,
            ISACTIVE: data.result.ISACTIVE,
            DIV: data.result.DIV,
            MAPID: data.result.MAPID,
            ACID: data.result.ACID
          });
        },
        error => {
          this.loadingService.hide();
          this.alertService.error(error);
        }
      );
    } else {
      if (this.Title == "AddLedger") {
        this.modeTitle = "Add Account Ledger";
      } else if (this.Title == "AddGroup") {
        this.modeTitle = "Add Account Group";
      }
    }
  }

  onAcGroupPopupTab() {
    this.acPopupGrid.show(this.AccCurrentSelectedGroup);
  }

  onItemDoubleClick(event) {
    this.AccCurrentSelectedGroup = event;

     console.log("selected group"+JSON.stringify(this.AccCurrentSelectedGroup));

    //  if(this.AccCurrentSelectedGroup.PARENT.substring(0,2) == "BS"){
    //    return this.showAssets = true;
    //  }

    if(this.AccCurrentSelectedGroup.ACID.substring(0, 2) == "AT")
    this.showAssets =1;
    else
    this.showAssets =0;
    let hasSubLedger =
      this.isGroup == 1
        ? this.AccCurrentSelectedGroup.HASSUBLEDGER
          ? 1
          : 0
        : 0;
    this.form.patchValue({
      HASSUBLEDGER: hasSubLedger,
      PARENT: this.AccCurrentSelectedGroup.ACNAME,
    });
    this.PARENTNAME.patchValue(this.AccCurrentSelectedGroup.ACNAME)
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });
  }

  majorgroupChange() {
    this.filter(this.form.get("majorparent").value);
  }

  filter(majorparent) {
    this.MasterService.getpartyListTree().subscribe(data => {
      var f = data.filter(x => x.ACID == majorparent)[0];
      if (f != null) {
        this.acParentList = f.children;
      }
    });
  }
  SumbitSave() {
    if (this.form.value.VATNO) {
      var pno = parseFloat(this.form.value.VATNO);
      if (pno.toString().length != 9) {
        this.alertService.error("PAN No is not correct");
        return;
      }
    }
    try {
     // this.form.value.MAPID = "N";
      let saveModel = Object.assign(<TAcList>{}, this.form.value);
      saveModel.DIV = this.userProfile.userDivision;
      //saveModel.MAPID = "N";
      if (this.mode == "edit") { 
        //this.editItem.ISACTIVE = saveModel.ISACTIVE
        //saveModel = this.editItem; 

       // console.log("editItem"+this.editItem);
        //console.log("Edit Account" + JSON.stringify(saveModel));

      }else{
        saveModel.PARENT = this.AccCurrentSelectedGroup.ACID;
      } 
      this.loadingService.show("Saving Data please wait...");
      let sub = this.MasterService.saveAccount(
        this.mode,
        saveModel,
        null
      ).subscribe(
        data => {
          this.loadingService.hide();
          if (data.status == "ok") {
            console.log("PARTYDATA@@@@", data);
            this.alertService.success("Data Saved Successfully");
            this.preventNavigationService.preventNavigation(false);
            setTimeout(() => {
              this.onClose.emit(true);
              this.router.navigate([this.returnUrl]);
            }, 1000);
          } else {
            //alert(data.result);
            //the ConnectionString in the server is not initialized means the the token 's user is not int the list of database user so it could't make connectionstring. Re authorization is requierd
            if (
              data.result._body ==
              "The ConnectionString property has not been initialized."
            ) {
              this.router.navigate(["/login", this.router.url]);
              return;
            }
            //Some other issues need to check
            this.alertService.error(
              "Error in Saving Data:" + data.result._body
            ); 
          }
        },
        error => {
          this.loadingService.hide();
          this.alertService.error(error);
        }
      );
      this.subcriptions.push(sub);
    } catch (e) {
      this.alertService.error(e);
    }
  }
  
  cancel() {
    try {
      this.router.navigate([this.returnUrl]);
    } catch (ex) {
      console.log(ex);
      this.alertService.error(ex);
    }
  } 

  changePtype(value) {
    this.form.get("Ptype").patchValue(value);
  }

  NotActive() {}

  closePartyPopup() {
    this.sParty.nativeElement.style.display = "none";
  }
}
