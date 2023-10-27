import { MdDialog } from "@angular/material";
import { SelectItem } from "primeng/primeng";
import { GroupParty } from "./PLedger.service";
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { MasterRepo } from "../../../../common/repositories/masterRepo.service";
import {
  AcListTree,
  OpticalEyeDetail,
  TAcList
} from "../../../../common/interfaces/Account.interface";
import { AuthService } from "../../../../common/services/permission";
import { PLedgerservice } from "./PLedger.service";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { PreventNavigationService } from "../../../../common/services/navigation-perventor/navigation-perventor.service";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";
import { TrnMain } from "../../../../common/interfaces/TrnMain";
import { GenericPopUpComponent, GenericPopUpSettings } from "../../../../common/popupLists/generic-grid/generic-popup-grid.component";

@Component({
  selector: "PLedger",
  templateUrl: "PLedger.html",
  providers: [PLedgerservice, TransactionService],
  styleUrls: ["../../../Style.css", "../../../../common/popupLists/pStyle.css"]
})
export class PLedgerComponent {
  @ViewChild("genericGridDistrict") genericGridDistrict: GenericPopUpComponent;
  gridPopupSettingsForDistrict: GenericPopUpSettings = new GenericPopUpSettings();
  @ViewChild("genericGriTransporter") genericGriTransporter: GenericPopUpComponent;
  gridPopupSettingsForTransporter: GenericPopUpSettings = new GenericPopUpSettings();

  @Output("onClose") onClose = new EventEmitter();
  ACID: string;
  @Input() rootID: string;
  @Input() PType: string;
  @Input() mode: string;
  @Input() grp: string;
  @Output() SavePartyEmit = new EventEmitter();



  public opticalEyeDetail: OpticalEyeDetail[] = [];




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
  private subcriptions: Array<Subscription> = [];
  initialTextReadOnly = false;
  ID: string = "";
  modeTitle: string;
  parentGroup: GroupParty;
  acGroups: any[] = [];
  actype: string = "";
  disableActype: boolean = false;
  lastParentID: string;
  userProfile: any;
  formObj: any = <any>{};
  Title: string = "";
  // PType: string;
  isGroup: number;
  PartyGrpList: any[] = [];
  ChannelList: any[] = [];
  GeoList: any[] = [];
  RouteList: any[] = [];
  BranchList: any[] = [];
  editModel: any = <any>{}
  geo: string = "none";
  CardName: any[] = [];
  StateList: any[] = [];
  itemDivisionList: any[] = [];
  TrnMainObj: TrnMain = <TrnMain>{};
  name: string;
  formSetting: any[] = [];
  cateList: any[] = [];
  constructor(
    private preventNavigationService: PreventNavigationService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    public MasterService: MasterRepo,
    private PartyService: PLedgerservice,
    router: Router,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MdDialog,
    private _authService: AuthService,
    private _trnMainService: TransactionService,
    public changeDetection: ChangeDetectorRef
  ) {


    this.MasterService.masterGetmethod_NEW("/casteList").subscribe((res) => {
      if (res.status == "ok") {
        this.cateList = res.result;
      }
    })
    this.router = router;
    this.TrnMainObj = this._trnMainService.TrnMainObj;
    this.opticalEyeDetail = this.MasterService.opticalEyeDetails;
    this.MasterService.GETTRNTYPE().subscribe(res => {
      if (res.status == 'ok') {
        this.CardName = res.result;
      }

    })

    this.MasterService.getState().subscribe(res => {
      if (res.status == 'ok') {
        this.StateList = res.result;
      }
    })
    this.itemDivisionList = [];
    if (this.mode != "edit") {
      this.MasterService.masterGetmethod("/getdistinctDivision").subscribe((res) => {
        if (res.status == "ok") {
          if (res.result.length) {
            this.itemDivisionList = res.result;
            // res.result.forEach(x => {
            //   this.itemDivisionList.push({
            //     LABEL: x.LABEL,
            //     DIVISIONS: false
            //   })
            // });
          }

        }
        else {
          this.alertService.error(res.result);
        }
      })
    }
    this.userProfile = this._authService.getUserProfile();
    this.gridPopupSettingsForDistrict = Object.assign(new GenericPopUpSettings, {
      title: "Districts",
      apiEndpoints: `/getDistrictsPagedList`,
      defaultFilterIndex: 0,
      columns: [

        {
          key: "District",
          title: "DISTRICT",
          hidden: false,
          noSearch: false
        },
        {
          key: "State",
          title: "STATE",
          hidden: false,
          noSearch: false
        },
        {
          key: "StateCode",
          title: "StateCode",
          hidden: true,
          noSearch: true
        }

      ]
    })
    this.gridPopupSettingsForTransporter = {
      title: "Transporter List",
      apiEndpoints: `/getAllTransporterPagedList`,
      defaultFilterIndex: 0,
      columns: [

        {
          key: "NAME",
          title: "NAME",
          hidden: false,
          noSearch: false
        },
        {
          key: "ADDRESS",
          title: "ADDRESS",
          hidden: false,
          noSearch: false
        },
        {
          key: "VEHICLENO",
          title: "VEHICLENO",
          hidden: true,
          noSearch: true
        },
        {
          key: "PHONE",
          title: "PHONE",
          hidden: true,
          noSearch: true
        }

      ]
    }


  }

  ngAfterContentChecked(): void {
    this.changeDetection.detectChanges();
  }

  ngAfterViewInit() {
    if (this.MasterService.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == "distributor") {
      this.form.patchValue({
        PMODE: "credit"
      });
    }
    if (this.PType == "C" && this.isGroup == 0) {
      this.formObj.Name = "Customer Name";
      this.formObj.PSType = "Sales Type";
      this.formObj.PMode = "Payment Mode";
      this.form.patchValue({
        PType: "C",
        TYPE: "A"
      });
    } else if (this.PType == "C" && this.isGroup == 1) {
      this.formObj.Name = "Group Name";
      this.form.patchValue({ PType: "C", TYPE: "G" });
    }
    // else if (this.PType == 'V' && (this.isGroup == false || this.isGroup == 'false')) {
    else if (this.PType == "V" && this.isGroup == 0) {
      this.formObj.Name = "Supplier Name";
      this.formObj.PSType = "Purchase Type";
      this.formObj.PMode = "Purchase Mode";
      this.form.patchValue({ PType: "V", TYPE: "A" });
    } else if (this.PType == "V" && this.isGroup == 1) {
      this.form.patchValue({ PType: "V", TYPE: "G" });
    }

    // document.getElementById('id') = 'General';
    this.PartyService.getPartyGroupByPtype(this.PType).subscribe(res => {
      if (res.status == "ok") {
        this.PartyGrpList = res.result;
      }
    });
    this.PartyService.getDIV().subscribe(res => {

      let userProfile = this._trnMainService.userProfile;
      this.BranchList = res.filter(x => x.INITIAL == userProfile.userDivision);
    });
    this.PartyService.getHierachy().subscribe(res => {
      if (res.status == "ok") {
        this.GeoList = res.result.GEO;
        this.ChannelList = res.result.CHANNEL;
        this.RouteList = res.result.Route;
      }
    });

    this.ChangePMODE(this.form.value.PMODE);
    this.form.get("SALESMAN").disable();
  }

  ngOnInit() {

    this.formSetting = this._activatedRoute.snapshot.data.formSetting.result;

    this.form = this._fb.group({
      PARENT: [""],
      TITLE: [""],
      ACNAME: [""],
      SHORTNAME: [""],
      CUSTOMERID: [""],
      CATEGORY: [""],
      Currency: [""],
      PMODE: [""],
      CRLIMIT: [0],
      CRPERIOD: [0],
      PSTYPE: ["local"],
      CDIVISION: [""],
      GSTTYPE: ["Un-Register"],
      MAILTYPE: ["None"],
      ISACTIVE: [1],
      ISPOSUPPLIER: [1],
      ISDISCONTINUED: [0],
      ADDRESS: [""],
      TEMPADDRESS: [""],
      CITY: [""],
      VILLAGE: [""],
      VILLAGECODE: [""],
      KHASHRA: [""],
      KHASHRAAREA: [""],
      STATE: [this._authService.getUserProfile().CompanyInfo.STATE],
      AREA: [""],
      LANDMARK: [""],
      PHONE: [""],
      MOBILE: [""],
      EMAIL: [""],
      ALTERNATEEMAIL: [""],
      DLNO1: [""],
      DLNO2: [""],
      DLNO3: [""],
      DLNO4: [""],
      POSTALCODE: [""],
      FAX: [""],
      VATNO: [""],
      ADHARNO: [""],
      GSTNO: [""],
      PRICELEVELCONFIG: [""],
      PRICELEVEL: [""],
      CTYPE: ["TAX INVOICE"],
      CAST: [""],
      ERPPLANTCODE: [""],
      ERPSTOCKLOCATIONCODE: [""],
      CBALANCE: [0],
      PType: [""],
      MAPID: [""],
      ACCODE: [""],
      ACID: [""],
      TYPE: [""],
      Channel: [""],
      SO: [""],
      GEO: [""],
      ROUTE: [""],
      RouteDays: [""],
      CDISCOUNT: [0],
      DISTANCE: [""],
      MCAT: ["%"],
      DISTRICT: [""],
      SALESMAN: [""],
      ANNIVERSARY: [new Date().toString().substr(0, 10)],
      BIRTHDAY: [new Date().toString().substr(0, 10)],
      REMARKS: [""],
      TRANSPORTERID: [""],
      TRANSPORTERNAME: [""],
      BILLINGLOCKDAYS: [""],
      ALLOWCREDIT: ["1"],
      jobWork: [0],
      ISGLOBALPARTY: [this._trnMainService.AppSettings.defaultCustomerAsLocal == 1 ? "0" : "1"]


    });

    this.onFormChanges();
    this.CrDisabled = 'enabled'

    if (!!this._activatedRoute.snapshot.params["mode"])
      this.mode = this._activatedRoute.snapshot.params["mode"];

    if (!!this._activatedRoute.snapshot.params["isGroup"])
      this.isGroup = this._activatedRoute.snapshot.params["isGroup"];

    if (!!this._activatedRoute.snapshot.params["ACID"])
      this.ACID = this._activatedRoute.snapshot.params["ACID"];

    if (!!this._activatedRoute.snapshot.params["PType"])
      this.PType = this._activatedRoute.snapshot.params["PType"];
    if (!!this._activatedRoute.snapshot.params["Title"])
      this.Title = this._activatedRoute.snapshot.params["Title"];

    if (!!this._activatedRoute.snapshot.params["returnUrl"])
      this.returnUrl = this._activatedRoute.snapshot.params["returnUrl"];

    this.getGroups();

    // this.MasterService.getAllAccount().subscribe(res => { this.ledgerAcList.push(<TAcList>res); });

    if (this.mode == "edit") {
      this.form.get("PARENT").disable();




      if (this._trnMainService.userProfile.CompanyInfo.ORG_TYPE == "distributor") {
        this.form.get("CUSTOMERID").disable();
      }
      if (this.userProfile.CompanyInfo.ORG_TYPE.toLowerCase() == 'superdistributor' && (this.userProfile.username.toLowerCase() != 'patanjali_user' && this.userProfile.username.toLowerCase() != 'patanjali_support')) {
        this.form.get("CUSTOMERID").disable();
        this.form.get("ISACTIVE").disable();
      }

      this.loadingService.show("Getting data, Please wait...");
      this.MasterService.getAllAccount(this.ACID).subscribe(
        data => {
          this.loadingService.hide();
          this.editModel = data.result;


          if (data.result.OpticalEyeDetail.length) {
            data.result.OpticalEyeDetail.forEach(op => {
              this.opticalEyeDetail.filter(x => x.LABEL == op.LABEL)[0].LEFT = op.LEFT;
              this.opticalEyeDetail.filter(x => x.LABEL == op.LABEL)[0].RIGHT = op.RIGHT;
            });
          }
          if (data.result2 != null || data.result2 != undefined) {
            this.SOTableList.push(data.result2)
          }

          this.setEditFromValue();
        },
        error => {
          this.loadingService.hide();
        }
      );
    }
    else if (this.mode == "view") {
      this.loadingService.show("Getting data, Please wait...");
      this.MasterService.getAllAccount(this.ACID).subscribe(
        data => {
          this.loadingService.hide();
          this.editModel = data.result;
          if (data.result.OpticalEyeDetail.length) {
            data.result.OpticalEyeDetail.forEach(op => {
              this.opticalEyeDetail.filter(x => x.LABEL == op.LABEL)[0].LEFT = op.LEFT;
              this.opticalEyeDetail.filter(x => x.LABEL == op.LABEL)[0].RIGHT = op.RIGHT;
            });
          }
          if (data.result2 != null || data.result2 != undefined) {
            this.SOTableList.push(data.result2)

          }

          this.setEditFromValue();
        },
        error => {
          this.loadingService.hide();
        }
      );
    }
    else {
      if (this.Title == "AddLedger") {
        this.modeTitle = "Add Party Ledger";
      } else if (this.Title == "AddGroup") {
        this.modeTitle = "Add Party Group";
      }
    }


    this.form.controls['GSTNO'].valueChanges.subscribe((res) => {
      this.form.controls['STATE'].setValue(res.substring(0, 2))
      if (res.toString().length >= 12) {
        this.form.controls['VATNO'].setValue(res.substring(2, 12))
      }
    })
  }


  setEditFromValue() {
    this.form.patchValue({
      PARENT: this.editModel.PARENT,
      TITLE: this.editModel.TITLE,
      ACNAME: this.editModel.ACNAME,
      SHORTNAME: this.editModel.shortname,
      CUSTOMERID: this.editModel.customerID,
      ERPSTOCKLOCATIONCODE: this.editModel.ERPSTOCKLOCATIONCODE,
      CATEGORY: this.editModel.CATEGORY,
      Currency: this.editModel.Currency,
      PMODE: this.editModel.PMODE,
      CRLIMIT: this.editModel.CRLIMIT,
      CRPERIOD: this.editModel.CRPERIOD,
      PSTYPE: this.editModel.PSTYPE,
      CDIVISION: this.editModel.CDIVISION,
      GSTTYPE: this.editModel.GSTTYPE,
      MAILTYPE: this.editModel.MAILTYPE,
      ISACTIVE: this.editModel.ISACTIVE,
      ISPOSUPPLIER: this.editModel.ISPOSUPPLIER ? "1" : "0",
      ISDISCONTINUED: this.editModel.ISDISCONTINUED,
      ADDRESS: this.editModel.ADDRESS,
      TEMPADDRESS: this.editModel.TEMPADDRESS,
      CITY: this.editModel.CITY,
      VILLAGE: this.editModel.VILLAGE,
      VILLAGECODE: this.editModel.VILLAGECODE,
      KHASHRA: this.editModel.KHASHRA,
      KHASHRAAREA: this.editModel.KHASHRAAREA,
      STATE: this.editModel.STATE,
      AREA: this.editModel.AREA,
      LANDMARK: this.editModel.LANDMARK,
      PHONE: this.editModel.PHONE,
      MOBILE: this.editModel.MOBILE,
      EMAIL: this.editModel.EMAIL,
      ALTERNATEEMAIL: this.editModel.ALTERNATEEMAIL,
      DLNO1: this.editModel.DLNO1,
      DLNO2: this.editModel.DLNO2,
      DLNO3: this.editModel.DLNO3,
      DLNO4: this.editModel.DLNO4,
      POSTALCODE: this.editModel.POSTALCODE,
      FAX: this.editModel.FAX,
      VATNO: this.editModel.VATNO,
      ADHARNO: this.editModel.ADHARNO,
      GSTNO: this.editModel.GSTNO,
      PRICELEVELCONFIG: this.editModel.PRICELEVELCONFIG,
      PRICELEVEL: this.editModel.PRICELEVEL,
      CTYPE: this.editModel.CTYPE,
      CAST: this.editModel.CAST,
      ERPPLANTCODE: this.editModel.ERPPLANTCODE,
      CBALANCE: this.editModel.CBALANCE,
      PType: this.editModel.PType,
      MAPID: this.editModel.MAPID,
      ACCODE: this.editModel.ACCODE,
      ACID: this.editModel.ACID,
      TYPE: this.editModel.TYPE,
      CDISCOUNT: this.editModel.CDISCOUNT,
      GEO: this.editModel.GEO,
      DISTANCE: this.editModel.DISTANCE,
      MCAT: this.editModel.MCAT,
      DISTRICT: this.editModel.DISTRICT,
      SALESMAN: this.editModel.SALESMAN,
      ANNIVERSARY: this.editModel.ANNIVERSARY ? this.editModel.ANNIVERSARY.toString().substr(0, 10) : new Date().toString().substr(0, 10),
      BIRTHDAY: this.editModel.ANNIVERSARY ? this.editModel.BIRTHDAY.toString().substr(0, 10) : new Date().toString().substr(0, 10),
      REMARKS: this.editModel.REMARKS,
      BILLINGLOCKDAYS: this.editModel.BILLINGLOCKDAYS,
      TRANSPORTERID: this.editModel.TRANSPORTERID,
      TRANSPORTERNAME: this.editModel.TRANSPORTERNAME,
      ALLOWCREDIT: this.editModel.ALLOWCREDIT,
      jobWork: this.editModel.jobWork,
      ISGLOBALPARTY: this.editModel.ISGLOBALPARTY
    });
    this.stateChangeEvent();
    this.geo = this.editModel.GEO;
    let edititemDivisionList = this.editModel.itemDivision ? this.editModel.itemDivision.split(',') : [];
    this.itemDivisionList = [];
    this.MasterService.masterGetmethod("/getdistinctDivision").subscribe((res) => {
      if (res.status == "ok") {
        if (res.result.length) {
          this.itemDivisionList = res.result;
          this.itemDivisionList.forEach(x => {
            edititemDivisionList.forEach(y => {
              if (x.LABEL.toLowerCase() == y.toLowerCase()) {
                x.DIVISIONS = true;
              }
            })
          })
        }

      }
      else {
        this.alertService.error(res.result);
      }
    })

  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(form => {

      if (this.form.dirty)
        this.preventNavigationService.preventNavigation(true);
    });


  }



  EnableGlobalCustomerSYnc() {
    let userprofiles = this.MasterService.userProfile;
    if (userprofiles && (userprofiles.CompanyInfo.companycode != "" || userprofiles.CompanyInfo.companycode != null)) {
      return true;
    }
    return false;
  }


  showDiscontinueOption() {
    if (this.userProfile.username.toLowerCase() == 'patanjali_user' || this.userProfile.username.toLowerCase() == 'patanjali_support') {
      return true;
    } else {
      return false;
    }
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
    let alertmsg: string;
    alertmsg = "";


    if (this.form.get("ISACTIVE").value == 1) {
      if (this.form.get("ACNAME").value == null || this.form.get("ACNAME").value == "" || this.form.get("ACNAME") == undefined) {
        alertmsg = alertmsg + "ACNAME";

      }

      if (this.form.get("MOBILE").value == null || this.form.get("MOBILE").value == "" || this.form.get("MOBILE") == undefined) {
        alertmsg = alertmsg + ", Mobile Number";
      }

      if (this.form.get("CTYPE").value == null || this.form.get("CTYPE").value == "" || this.form.get("CTYPE").value == undefined) {
        alertmsg = alertmsg + ", Invoice Type";
      }


      if (this.form.get("STATE").value == null || this.form.get("STATE").value == "") {
        alertmsg = alertmsg + ",State";
      }



      if (this.form.value.VATNO) {
        var pno = parseFloat(this.form.value.VATNO);
        // if (pno.toString().length != 9) {
        //   this.alertService.error("PAN No is not correct");
        //   return;
        // }
      }

      if (alertmsg != "") {
        alertmsg = "Please provide " + alertmsg;
        this.alertService.warning(alertmsg);
        document.getElementById("ACNAME").focus();
        return;

      }
      if (this.form.value.MOBILE.length != 10) {
        this.alertService.warning("Mobile number is invalid! Please enter atleast 10 digit number. ");
        return
      }
      if (this.form.controls['GSTNO'].value && this.form.controls['GSTNO'].value.toString().length > 15) {
        this.alertService.warning("GST No Cannot be more than 15 digit number. ");
        return
      }


      let gstno: string = this.form.controls['GSTNO'].value;
      let customerStateCode: string = this.form.controls['STATE'].value;
      if (gstno != null && gstno != "" && gstno != undefined && customerStateCode != null && customerStateCode != "" && customerStateCode != undefined) {
        if (gstno.substring(0, 2) != (customerStateCode.length == 2 ? customerStateCode : '0' + customerStateCode)) {
          this.alertService.error("GST Number and State Code doesn't match. Please review first two character of GST No and your statecode");
          return false;
        }
      }


    }
    try {
      let al = <TAcList>{};

      this.form.value.MAPID = "N";

      if (this.mode == "edit") {
        al.ACID = this.ACID;
      }


      let saveModel = this.form.value;


      if (this.itemDivisionList.length) {
        let selectedDivisions = [];
        this.itemDivisionList.forEach(x => {
          if (x.DIVISIONS) {
            selectedDivisions.push(x.LABEL);
          }
        })
        saveModel.itemDivision = selectedDivisions.length ? selectedDivisions.join() : '';

      }


      //discount not allow for other category
      // if (this.geo != 'fitindia') {
      //   saveModel.CDISCOUNT = 0;
      //   this.form.patchValue({
      //     CDISCOUNT: 0
      //   });
      // }



      if (this.PType == 'C') {
        saveModel.PType = "C"
      }
      else {
        saveModel.PType = "V"
      }

      saveModel.GEO = this.geo;
      let aaa = this.GeoList.filter(x => x.CATEGORY_NAME == this.geo)[0];
      if (aaa != null) {
        saveModel.PRICELEVEL = aaa.PRICE_LEVEL;
      }
      saveModel.TYPE = "A"
      saveModel.PARENT = "PA";
      saveModel.ACNAME = this.form.controls['ACNAME'].value;
      saveModel.SHORTNAME = this.form.controls['SHORTNAME'].value;
      saveModel.ACCODE = saveModel.CUSTOMERID = this.form.controls['CUSTOMERID'].value;




      if (saveModel.CUSTOMERID == "988881") {
        saveModel.PRICELEVEL = "fitindia"
        saveModel.GEO = "fitindia"

      }


      if (this._trnMainService.AppSettings.VALIDATEAADHARNO == 1) {
        if (saveModel.ADHARNO == null || saveModel.ADHARNO == "" || saveModel.ADHARNO == undefined) {
          this.alertService.warning("Aadhar No is mandatory. ");
          return
        }
      }

      saveModel.VATNO = this.form.controls['VATNO'].value;
      saveModel.CRLIMIT = this.form.controls['CRLIMIT'].value;
      saveModel.MCAT = this.form.controls['MCAT'].value;
      saveModel.CDISCOUNT = this.MasterService.nullToZeroConverter(this.form.controls['CDISCOUNT'].value);
      saveModel.DISTANCE = this.MasterService.nullToZeroConverter(this.form.controls['DISTANCE'].value);
      saveModel.MODE = this.mode;
      saveModel.ISPOSUPPLIER = this.form.controls['ISPOSUPPLIER'].value == "1" ? true : false;
      this.loadingService.show("Saving Data please wait...");
      saveModel.OpticalEyeDetail = this.opticalEyeDetail;
      let sub = this.MasterService.saveAccount_new(saveModel).subscribe(
        data => {
          this.loadingService.hide();
          if (data.status == "ok") {
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
      this.alertService.error(ex);
    }
  }

  changePtype(value) {
    this.form.get("Ptype").patchValue(value);
  }

  public onGrpChange(event, i, selected) {
    try {
      if (selected) {
        this.parentGroup = selected;
      }

      let opt: SelectItem[] = [];
      var ind = i;

      if (event) {
        if (this.acGroups.length > ind + 1) {
          this.acGroups.splice(ind + 1, this.acGroups.length - 1);
        }
        this.lastParentID = event.value.ACID;
        this.PartyService.getChildrenGroups(event.value.ACID)
          .flatMap(data => data)
          .subscribe(
            data => {
              if (data.TYPE == "G")
                opt.push({ label: data.ACNAME, value: data });
            },
            Error => this.alertService.error(Error),
            () => {
              if (opt.length > 0) {
                this.acGroups.push({
                  group: event.value.ACNAME,
                  value: event.value,
                  options: opt
                });
              }

            }
          );
      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  getGroups() {
    this.actype = "";
    this.disableActype = false;
    this.acGroups = [];
    this.getMainGroup();
    if (!this.ACID) return;
    this.PartyService.getParentGroups(this.ACID)
      .flatMap(data => data)
      .subscribe(
        data => {
          try {
            data.SELECTEDGROUPAC = data.CHILDLIST.find(
              itm => itm.ACID == data.SELECTEDGROUP
            );
            this.parentGroup = data.SELECTEDGROUPAC;
            let opt: SelectItem[] = [];
            data.CHILDLIST.forEach(child => {
              opt.push({ label: child.ACNAME, value: child });
            });
            this.acGroups.push({
              group: data.ACNAME,
              value: data,
              options: opt
            });
          } catch (ex) {
            this.alertService.error(ex);
          }
        },
        error => {
          this.alertService.error(error);
        },
        () => {
          if (this.acGroups.length > 1) {
            let selectedGroup = this.acGroups[0].options.find(
              itm => itm.value.ACID == this.acGroups[1].value.ACID
            );
            if (selectedGroup) {
              this.acGroups[0].value.SELECTEDGROUPAC = selectedGroup.value;
            }
          }
        }
      );

    return;
  }

  getMainGroup() {
    let opt: SelectItem[] = [];
    this.PartyService.getTopGroups()
      .flatMap(data => data)
      .subscribe(data => {
        opt.push({ label: data.ACNAME, value: data });
      });
    this.acGroups.push({
      group: "Main Group",
      value: { ACNAME: "MAIN GROUP", ACID: null, PARENT: null },
      options: opt
    });
  }

  clickedNotActive(value) {
    if (this.form == null) {
      return;
    }
    this.form.get("isNotActive").patchValue(value);
  }
  NotActive() { }
  partyList: any[] = [];
  solist: any[] = [];
  SOTableList: any[] = [];
  RCODE: any;
  RouteClick(value) {
    this.RCODE = value;
    this.PartyService.getSOFromRoute(value).subscribe(res => {
    });
  }

  SOChange(value) {
    let soName = this.solist.filter(x => x.CODE == value)[0];
    this.form.patchValue({
      SO: soName ? soName.CODE : ""
    });
  }

  RouteAdd() {
    let a: any = <any>{};
    var formValue = this.form.value;
    var route = this.RouteList.filter(x => x.RouteCode == formValue.ROUTE)[0];
    let soName = this.solist.filter(x => x.CODE == formValue.SO)[0];

    if (soName == undefined || soName == null) {
      this.alertService.info("All fields are required.");
      return;
    }

    a.SONAME = soName ? soName.NAME : "";
    a.RouteName = route ? route.RouteName : "";
    a.SOCODE = soName ? soName.CODE : "";
    a.PCL = soName ? soName.PCL : "";
    this.SOTableList.push(a);

    this.form.patchValue({
      ROUTE: "",
      SO: "",
      SONAME: "",
      RouteDays: ""
    });
  }

  deleteSOList(index: number) {
    this.SOTableList.splice(index, 1);
  }

  CrDisabled: string;
  Crvalue: string
  ChangePMODE(value) {
    this.Crvalue = value;
    if (value == "credit" || value == "cashandcredit") {
      this.CrDisabled = 'enable';
    }
    else {
      this.CrDisabled = 'disabled';
      this.form.patchValue({
        CRLIMIT: 0,
        CRPERIOD: 0
      })
    }
  }
  CreditDisabled() {
    try {
      if (this.Crvalue == "credit" || this.Crvalue == 'cashandcredit') {
        this.CrDisabled = 'enable';
        return "white";
      } else {
        this.CrDisabled = 'disabled';
        return "#EBEBE4";

      }
    } catch (ex) {
      this.alertService.error(ex);
    }
  }
  changePriceLevel() {

    alert("Changes on Pricelevel will affects the Category also!")

  }
  stateChangeEvent() {


    if (parseFloat(this.form.value.STATE) == parseFloat(this.MasterService.userProfile.CompanyInfo.STATE)) {
      this.form.patchValue({ "PSTYPE": "local" });

    }
    else {
      this.form.patchValue({ "PSTYPE": "interstate" });
    }
  }




  showItemDivision() {
    if (this.userProfile.username.toLowerCase() == "patanjali_user" || this.userProfile.username.toLowerCase() == "patanjali_support") {
      return true;
    } else {
      return false;
    }
  }

  preventInput($event) {
    $event.preventDefault();
    return false;
  }
  DistrictTabCommand(e) {
    e.preventDefault();
    document.getElementById("districtselectid").blur();
    var statename = "";
    var s = this.StateList.filter(x => x.StateCode == this.form.get("STATE").value)[0];
    if (s != null) { statename = s.StateName; }
    this.genericGridDistrict.show(statename);
  }
  TransporterTabCommand(e) {
    this.genericGriTransporter.show();
  }


  onDistrictSelected(district) {


    this.form.controls['DISTRICT'].setValue(district.District);
    this.form.controls['STATE'].setValue(district.StateCode);


  }
  categoryChange() {
    let aaa = this.GeoList.filter(x => x.CATEGORY_NAME == this.geo)[0];
    if (aaa != null) {
      this.form.controls['PRICELEVEL'].setValue(aaa.PRICE_LEVEL);
    }
  }


  onTransporterSelected(transporter) {
    this.form.controls['TRANSPORTERID'].setValue(transporter.TRANSPORTERID);
    this.form.controls['TRANSPORTERNAME'].setValue(transporter.NAME);
  }





}

