import { Inject, Injectable } from "@angular/core";
import { TSubLedger } from "./../interfaces/TrnMain";
import { TrnMain } from "./../interfaces/TrnMain";
import { TAcList } from "./../interfaces/Account.interface";
import * as _ from "lodash";
import * as moment from 'moment'
import {
  IRateGroup,
  IDivision
} from "../interfaces/commonInterface.interface";
// import { SalesTerminal } from "../../pages/masters/components/sales-terminal/sales-terminal.interface"
import { Http, Response, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { AuthService } from "../services/permission/authService.service";
import { Subject } from "rxjs/subject";
import { GlobalState } from "../../global.state";
import { Observable } from "rxjs/Observable";
import { Subscriber } from "rxjs/Subscriber";
import {
  VoucherTypeEnum,
  CostCenter,
  Warehouse
} from "../interfaces/TrnMain";
import { IndexedDbWrapper, SettingService, AppSettings } from "../services";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { LoginDialog } from "../../pages/modaldialogs/index";
import { MdDialog } from "@angular/material";
import { MessageDialog } from "../../pages/modaldialogs/messageDialog/messageDialog.component";
import { Company } from "../interfaces/CompanyInfo.interface";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { Item } from "../interfaces/ProductItem";
import { DOCUMENT } from "@angular/platform-browser";
@Injectable()
export class MasterRepo {
  masterFormfieldSetting: any[] = [];
  private _rateGroups: Array<IRateGroup> = [];

  public serverDate: Date = new Date();
  private _account: TAcList[] = [];
  private _subLedger: TSubLedger[] = [];
  private _reqOption: RequestOptions;
  public _itemList: Item[] = [];
  public PartialProductList: any[] = [];
  public ProductGroupTree: any[] = [];
  private _accountTree: any[] = [];
  private _accountPartyTree: any[] = [];
  public _ptypeList: any[] = [];
  public _Units: any[] = [];
  public _Chanels: any[] = [];
  public Currencies: any[] = [];
  public AllDivisions: any[] = [];
  recentDate: Subject<any>;
  newDate: string;
  customerList: any[] = [];
  supplierList: any[] = [];
  BEATLIST: any[] = [];
  DSMLIST: any[] = [];


  opticalEyeDetails: any[] = [
    {
      LABEL: "Sv/kry",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Sph",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Cyl",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Axis",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Add",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Pd",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "V/A",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Prism",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Fitting Height",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Upper Segment",
      LEFT: null,
      RIGHT: null
    },
    {
      LABEL: "Lens Dia",
      LEFT: null,
      RIGHT: null
    }
  ]

  private get _lastProductChangeDateLocal(): Date {
    return <Date>(
      this.authService.getSessionVariable("LastProductChangeDateLocal")
    );
  }
  private get _lastProductStockCheckDateLocal(): Date {
    return <Date>(
      this.authService.getSessionVariable("LastProductStockCheckDateLocal")
    );
  }
  public get isInventryYearEnd(): number { return this.authService.getSessionVariable("isIYE"); }
  public get isAccountYearEnd(): number { return this.authService.getSessionVariable("isAYE"); }
  public get itemList(): Item[] {
    return this._itemList;
  }
  public get accountList(): TAcList[] {
    return this._account;
  }

  //Observable for divisionList
  public _divisions: Array<IDivision> = [];

  private _divisionListObservable: Observable<Array<IDivision>>;
  public rateGroups: Subject<Array<IRateGroup>> = new Subject();
  private Subscriptions: any[];
  public PartialAccountList: any[] = [];
  private subject: Subject<Command>;
  commands: Observable<Command>;
  ShowMore = false;
  PType: string;
  partyPopUpHeaderText: string = "";
  PlistTitle: string = "";
  userProfile: any = <any>{};
  userSetting: any = <any>{};
  MCODEWISE_ITEMSTOCKLIST: any[] = [];
  fiscalYearList: any[] = [];
  warehouses: any[] = [];
  dateFilterRange: any;
  funKeySetting: any[] = [];
  public variantmaster = [];

  public customerPopUpSubject = new Subject<any>();
  public customerMobileSubject = new Subject<string>();
  public invoiceDetailSubject = new Subject<any>();
  public onWarehouseChangeEvent = new Subject<string>();


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: Http,
    private authService: AuthService,
    private state: GlobalState,
    private dbWrapper: IndexedDbWrapper,
    public dialog: MdDialog,
    private setting: SettingService,
    private hotkeysService: HotkeysService,
    public appSetting: AppSettings
  ) {
    this.getReportFilterData();
    this.getCurrentDate().subscribe(date => {

      this.serverDate = date.Date;
    });
    this.userProfile = authService.getUserProfile();
    this.userSetting = authService.getSetting();
    this.funKeySetting = authService.getFunctionKeySetting();
    this.authService.setSessionVariable(
      "LastProductStockCheckDateLocal",
      new Date("1990-01-01T00:00:00")
    );
    this.refreshTransactionList();
    let FBDATE = (this.userProfile.CompanyInfo.FBDATE).substr(0, 10);
    let FEDATE = (this.userProfile.CompanyInfo.FEDATE).substr(0, 10);
    this.dateFilterRange = {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'Pre Fiscal Year': [moment(new Date(FBDATE)).set('date', 1).subtract(1, 'year').set('month', 3), moment(new Date(FBDATE)).subtract(1, 'month').endOf('month')],
      'Fiscal Year': [moment(new Date(FBDATE)).set('date', 1).set('month', 3), moment(new Date(FEDATE)).endOf('month').set('month', 2)],

    }
    this.getFiscalYearList().subscribe((res) => {
      if (res.status == "ok") {
        this.fiscalYearList = res.result;
      } else {
        this.fiscalYearList = [];
      }
    })
    this.getWarehousesList().subscribe((res) => {
      if (res.status == "ok") {
        this.warehouses = res.result;
      } else {
        this.warehouses = [];
      }
    })

    this.masterPostmethod_NEW("/getcategorywiseconfiguration", {}).subscribe((res) => {
      if (res.result && res.result.length) {
        this.variantmaster = res.result;
      } else {
        this.variantmaster = [];
      }
    }, error => {
      this.variantmaster = [];
    })

  }
  ngAfterViewInit() {
    this.subject = new Subject<Command>();
    this.commands = this.subject.asObservable();
    this.http
      .get("./../../assets/config.json")
      .toPromise()
      .then(r => r.json() as ConfigModel)
      .then(c => {
        for (const key in c.hotkeys) {
          const commands = c.hotkeys[key];
          this.hotkeysService.add(
            new Hotkey(key, (ev, combo) => this.hotkey(ev, combo, commands))
          );
        }
      });
  }


  //commented beacuse of load on chrome like error Failed to execute 'setItem' on 'Storage': Setting the value of 'CUSTOMER' exceeded the quota
  getReportFilterData() {
    // this.masterGetmethod_NEW("/getMiniPartyItem/C").subscribe((res) => {
    //   if (res.status == "ok") {
    //     localStorage.setItem("CUSTOMER", JSON.stringify(res.result))
    //   } else {
    //     localStorage.setItem("CUSTOMER", null)
    //   }

    // }, error => {

    // })
    // this.masterGetmethod_NEW("/getMiniPartyItem/V").subscribe((res) => {
    //   if (res.status == "ok") {
    //     localStorage.setItem("SUPPLIER", JSON.stringify(res.result))

    //   } else {
    //     localStorage.setItem("SUPPLIER", null)
    //   }
    // })
    // this.masterGetmethod_NEW("/getAllDsmList").subscribe((res) => {
    //   if (res.status == "ok" && res.result && res.result.length) {
    //     localStorage.setItem("DSM", JSON.stringify(res.result))
    //     localStorage.setItem("BEAT", JSON.stringify(res.result2))

    //   } else {
    //     localStorage.setItem("DSM", null)
    //     localStorage.setItem("BEAT", null)
    //   }
    // }, error => {
    //   localStorage.setItem("DSM", null)
    //   localStorage.setItem("BEAT", null)

    // })



    this.masterGetmethod_NEW("/getMiniPartyItem/C").subscribe((res) => {
      if (res.status == "ok") {
        this.customerList = res.result
      }

    }, error => {

    })
    this.masterGetmethod_NEW("/getMiniPartyItem/V").subscribe((res) => {
      if (res.status == "ok") {
        this.supplierList = res.result;

      }
    })
    this.masterGetmethod_NEW("/getAllDsmList").subscribe((res) => {
      if (res.status == "ok" && res.result && res.result.length) {
        this.DSMLIST = res.result;
        this.BEATLIST = res.result2;

      }
    }, error => {

    })




























  }

  hotkey(ev: KeyboardEvent, combo: string, commands: string[]): boolean {
    commands.forEach(c => {
      const command = {
        name: c,
        ev: ev,
        combo: combo
      } as Command;
      this.subject.next(command);
    });
    return true;
  }
  public refreshTransactionList() {
    this.AllDivisions = [];
    this.getAllDivisions().subscribe((res) => {
      this.AllDivisions.push(res)
    })

  }

  //OBSERVABLE ReDefined
  //Division list observable
  private allDivisionSubject: BehaviorSubject<
    IDivision[]
  > = new BehaviorSubject<IDivision[]>([]);
  public allDivisionList$: Observable<
    IDivision[]
  > = this.allDivisionSubject.asObservable();
  public _divisionListSubject: BehaviorSubject<
    IDivision[]
  > = new BehaviorSubject<IDivision[]>([]);
  public divisionList$: Observable<
    IDivision[]
  > = this._divisionListSubject.asObservable();
  public refreshDivsionList(refresh: boolean = false) {
    let divList: IDivision[] = [];

    this.http
      .get(this.apiUrl + "/getDivisionlist", this.getRequestOption())
      .flatMap(res => res.json() || [])
      .map(ret => {
        divList.push(<IDivision>ret);
        this.allDivisionSubject.next(divList);
        return divList;
      })
      .map(ret => {
        if (this.setting.appSetting.UserwiseDivision == 1) {
          var divs: IDivision[] = [];
          var userdivs = <string[]>this.setting.appSetting.userDivisionList;
          ret.forEach(div => {
            var divitem = userdivs.find(d => d == div.INITIAL);
            if (divitem) {
              divs.push(div);
            }
          });
          return divs;
        }
        else {
          return ret;
        }
      })
      .share()
      .subscribe(
        data => {
          this._divisionListSubject.next(data);
        },
        error => {
          var err = error;
          //alert(err);
        },
        () => {
          this._divisions = divList;
        }
      );
  }
  //-------end of divisionlist----------------

  //Cost Center
  public costCenterSubject: BehaviorSubject<CostCenter[]> = new BehaviorSubject<
    CostCenter[]
  >([]);
  public costCenterList$: Observable<
    CostCenter[]
  > = this.costCenterSubject.asObservable();

  public refreshCostCenters() {
    let _costCenterList: CostCenter[] = [];
    this.http
      .get(this.apiUrl + "/getCostCenterList", this.getRequestOption())
      .flatMap(res => res.json() || [])
      .map(ret => {
        _costCenterList.push(<CostCenter>ret);
        return _costCenterList;
      })
      .share()
      .subscribe(
        data => {
          this.costCenterSubject.next(data);
        },
        error => {
          this.resolveError(error, "masterRepo-getCostCenters");
        }
      );
  }

  //---end costcenter
  // WarehouseList
  public warehouseSubject: BehaviorSubject<Warehouse[]> = new BehaviorSubject<
    Warehouse[]
  >([]);
  public warehouseList$: Observable<
    Warehouse[]
  > = this.warehouseSubject.asObservable();
  private allWarehouseSubject: BehaviorSubject<
    Warehouse[]
  > = new BehaviorSubject<Warehouse[]>([]);
  public allWarehouseList$: Observable<
    Warehouse[]
  > = this.allWarehouseSubject.asObservable();

  public refreshWarehouses() {
    let wlist: Warehouse[] = [];
    this.http
      .get(this.apiUrl + "/getWarehouseList", this.getRequestOption())
      .flatMap(response => response.json() || [])
      .map(ret => {
        wlist.push(<Warehouse>ret);
        this.allWarehouseSubject.next(wlist);
        return wlist;
      })
      // .map(ret => {
      //     if (this.setting.appSetting.UserwiseDivision == 1) {
      //         var wares: Warehouse[] = [];
      //         var userWares = <string[]>this.setting.appSetting.userWarehouseList;
      //         userWares.forEach(ware => {
      //             var war = ret.find(w => w.NAME == ware);
      //             if (war) {
      //                 wares.push(war);
      //             }
      //         });
      //         return wares;
      //     }
      //     else {
      //         return ret;
      //     }
      // })
      .share()
      .subscribe(
        data => {
          this.warehouseSubject.next(data);
        },
        error => {
          this.resolveError(error, "masterService-getwarehouses");
        }
      );
  }

  //---end of WarehouseList
  //------end of redefined

  // RateGroupList
  public rateGroupSubject: BehaviorSubject<IRateGroup[]> = new BehaviorSubject<
    IRateGroup[]
  >([]);
  public rateGroupList$: Observable<
    IRateGroup[]
  > = this.rateGroupSubject.asObservable();
  public refreshRateGroupList() {
    let rlist: IRateGroup[] = [];
    this.http
      .get(this.apiUrl + "/getRateGroupList", this.getRequestOption())
      .flatMap(response => response.json() || [])
      .map(ret => {
        rlist.push(<IRateGroup>ret);
        return rlist;
      })
      .share()
      .subscribe(
        data => {
          this.rateGroupSubject.next(data);
        },
        error => {
          this.resolveError(error, "masterService-getrateGroup");
        }
      );
  }
  //---end of RateGroupList
  //accountlist
  accountSubject: BehaviorSubject<TAcList[]> = new BehaviorSubject<TAcList[]>(
    []
  );
  accountList$: Observable<TAcList[]> = this.accountSubject.asObservable();
  public refreshAccountList(calledFrom: string) {
    var ilist: TAcList[] = [];
    if (this._account.length > 0) return;
    this.http
      .get(this.apiUrl + "/getAccountList", this.getRequestOption())
      .flatMap(res => res.json() || [])
      .share()
      .subscribe(
        data => {
          ilist.push(<TAcList>data);
          this.accountSubject.next(ilist);
        },
        Error => {
          this.accountSubject.complete();
        },
        () => {
          this._account = ilist;
          this.accountSubject.next(ilist);
          this.accountSubject.complete();
        }
      );
  }

  saveCashHandover() {

  }

  // public getDenominationList()
  // {
  //   return this.http.get(this.apiUrl + "/getDenominationList",this.getRequestOption())
  // }

  public getDenominationList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getDenominationList", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }


  public getDenominationTotal(a) {

    this.newDate = moment(this.serverDate).format('YYYY/MM/DD')
    // return this.http.get(this.apiUrl + `/getDenominationTotal?dateTime=2020-12-14 00:00:00`, this.getRequestOption())


    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + `/getDenominationTotal?dateTime=${a}`, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getPrintCashHandover(date) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + `/getprintCashHandover?dateTime=${date}`, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    // return this.http.get(this.apiUrl + `/getprintCashHandover?param=2020-12-16`, this.getRequestOption())
  }


  public saveDenomination(denoList) {
    // let body =[{
    //   "userid": "string",
    //   "trndate": "2020-12-14T04:51:08.345Z",
    //   "terminalid": "string",
    //   "sessionid": 0,
    //   "denO_NAME": deno_name,
    //   "qty": counter,
    //   "basevalue": 0,
    //   "amount": total,
    //   "division": "string",
    //   "phiscalID": "string",
    //   "denoList": [
    //     null
    //   ]
    // }]
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(this.apiUrl + "/saveDenomination", denoList, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          returnSubject.next(retData);
        } else {
          returnSubject.next(retData);
        }
      });
    return returnSubject;
  }


  //Barcode
  public getBarcode(itemCodeList) {
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(this.apiUrl + "/getProductBarcode", itemCodeList, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          returnSubject.next(retData);
        } else {
          returnSubject.next(retData);
        }
      });
    return returnSubject;
  }



  public getNewPrice(data) {
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(this.apiUrl + "/getNewPrice", data, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          returnSubject.next(retData);
        } else {
          returnSubject.next(retData);
        }
      });
    return returnSubject;
  }

  public savePriceDrop(data) {
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(this.apiUrl + "/savePriceDrop", data, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          returnSubject.next(retData);
        } else {
          returnSubject.next(retData);
        }
      });
    return returnSubject;
  }





  //end accountlist
  public get apiUrl(): string {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl = "";

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    return apiUrl;
  }
  public get imageServer(): string {
    let url = this.state.getGlobalSetting("imageServer");
    let imageServer = "";

    if (!!url && url.length > 0) {
      imageServer = url[0];
    }
    return imageServer;
  }
  public getRequestOption() {
    let headers: Headers = new Headers({
      "Content-type": "application/json",
      Authorization: this.authService.getAuth().token,
      "X-Requested-With": 'XMLHttpRequest'
    });
    return new RequestOptions({ headers: headers });
  }

  prodListHttp$ = this.http
    .post(
      this.apiUrl + "/getProductList",
      { EDATE: this._lastProductChangeDateLocal },
      this.getRequestOption()
    )
    .flatMap(res => res.json() || [])
    .share();

  public getVoucherNo(TrnMainObj: any) {
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(this.apiUrl + "/getVoucherNo", TrnMainObj, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          returnSubject.next(retData);
        } else {
          returnSubject.next(retData);
        }
      });
    return returnSubject;
  }
  public updatebatchMigration() {
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(this.apiUrl + "/updateBatchOfMigration", {}, this.getRequestOption())
      .subscribe(data => {
        let retData = data.json();
        if (retData.status == "ok") {
          returnSubject.next(retData);
        } else {
          returnSubject.next(retData);
        }
      });
    return returnSubject;
  }
  // public itemListSubject: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  // public _itemListObservable$: Observable<Item[]> = this.itemListSubject.asObservable();

  public _itemListObservable$: Observable<Item[]>;

  public getProductItemList() {
    try {
      if (this._itemList.length > 0) {
        return Observable.of(this._itemList);
      } else if (this._itemListObservable$) {
        return this._itemListObservable$;
      } else {
        this._itemListObservable$ = null;
        this._itemListObservable$ = this.http
          .post(
            this.apiUrl + "/getProductList",
            { EDATE: this._lastProductChangeDateLocal },
            this.getRequestOption()
          )
          .flatMap(res => res.json() || [])
          .map(data => {
            this._itemList.push(<Item>data);
            return this._itemList;
          })
          .share();
        return this._itemListObservable$;
      }
    }
    catch (ex) {
    }
  }
  public getProductItemPagedList() {
    try {
      if (this._itemList.length > 0) {
        return Observable.of(this._itemList);
      }
      else if (this._itemListObservable$) {
        return this._itemListObservable$;
      }
      else {
        this._itemListObservable$ = null;
        this._itemListObservable$ = this.http.post(this.apiUrl + '/getProductPagedList', { EDATE: this._lastProductChangeDateLocal }, this.getRequestOption())
          .flatMap(res => res.json() || [])
          .map(data => {
            this._itemList.push(<Item>data)
            return this._itemList;
          })
          .share();
        return this._itemListObservable$;
      }
    }
    catch (ex) {
    }
  }

  nullToZeroConverter(value) {
    if (
      value == undefined ||
      value == null ||
      value == "" ||
      value == "Infinity" ||
      value == "NaN" ||
      isNaN(parseFloat(value))
    ) {
      return 0;
    }
    return parseFloat(value);
  }
  public refreshProductItemList() {
    try {
      if (this._itemList.length > 0) return;
      var plist: Item[] = [];
      var LastDate = new Date("1900-01-01T00:00:00");
      var db = this.dbWrapper.dbHelper;
      this.prodListHttp$.share().subscribe(
        data => {
          var pitem = <Item>data;
          if (LastDate < pitem.EDATE) {
            LastDate = pitem.EDATE;
          }
          db.update("PRODUCT", pitem).catch(error => {
          });
        },
        Error => {

        },
        () => {
          this.authService.removeSessionVariable("LastProductChangeDateLocal");
          //this._itemList = plist;
        }
      );
    } catch (ex) {
    }
  }

  public getRemarksMaster(apiEndpoints: string) {

    var requestUrl = `${this.apiUrl}${apiEndpoints}`
    return this.http
      .get(requestUrl, this.getRequestOption())
      .map(res => res.json() || [])


  }

  public getRateGroups() {

    this.state.subscribe("rateGroupList", data => {
      this._rateGroups = data;
      this.rateGroups.next(data);
    });
  }
  private getRateGroupsFromApi() {
    let url = this.state.getGlobalSetting("apiUrl");
    let apiUrl;

    if (!!url && url.length > 0) {
      apiUrl = url[0];
    }
    let retRateGroups: Array<IRateGroup> = [];
    this.http
      .get(apiUrl + "/getRateGroupList", this.getRequestOption())
      .flatMap(Response => Response.json() || [])
      .subscribe(
        data => {
          retRateGroups.push(<IRateGroup>data);
        },
        error => {
        },
        () => {
          this.state.notifyDataChanged("rateGroupList", retRateGroups);
        }
      );
  }

  public getDivisions(refresh: boolean = false) {
    let dlist = [];
    let returnDiv = [];
    this.getAllDivisions().subscribe(res => {
      dlist.push(<any>res);
      if (this.setting.appSetting.UserwiseDivision == 1) {
        var divs = [];
        var userdivs = <string[]>this.setting.appSetting.userDivisionList;
        dlist.forEach(div => {
          var divitem = userdivs.find(d => d == div.INITIAL);
          if (divitem) {
            divs.push(div);
          }
        });
        returnDiv = divs;
      } else {
        returnDiv = dlist;
      }
    });
    return Observable.of(returnDiv);
  }

  //New Api
  public getMGroupFromMenuItem() {
    return this.http
      .get(this.apiUrl + "/getMGroupFromMenuItem", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getPartyGroup() {
    return this.http
      .get(this.apiUrl + "/getPartyGroup", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  //---------------------

  public getAllDivisions() {
    return this.http
      .get(this.apiUrl + "/getDivisionlist", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getAllDivisionsFortargetCompanyId(targetCompanyId: string) {
    return this.http
      .get(this.apiUrl + "/getDivisionlist?targetCompanyId=" + targetCompanyId, this.getRequestOption())
      .flatMap(response => response.json() || []);
  }


  public getReportDetails() {
    return this.http
      .get(this.apiUrl + "/getReportDetails", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getCurrencies() {
    return this.http
      .get(this.apiUrl + "/getCurrencyList", this.getRequestOption())
      .flatMap(response => response.json() || [])
      .subscribe(res => {
        this.Currencies.push(<any>res);
      });
  }
  public getSalesman(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSalesmanList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  private getSalesmanFromApi() { }

  public getCostCenter(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getCostCenterList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  public getAllCostCenter(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getAllCostCenterList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  private getCostCenterFromApi() { }
  public getCategory(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getCategoryList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  public getAllCategory(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getAllCategoryList", this.getRequestOption())
      .flatMap(response => response.json() || []);
    //.subscribe(res=>{
    //   this._divisions.push(<IDivision>res);
    //this.subjectDivision.next(this._divisions);
    //})
  }
  private getCategoryFromApi() { }
  public getAllCat() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getAllCategoryList", this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public getSalesTerminal(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getSalesTerminalList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getWarehouse(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllWarehouseList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getWarehouseFortargetCompanyId(targetCompanyId: string, refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllWarehouseList?targetCompanyId=" + targetCompanyId, this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getTerminalCategory(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getTerminalCategoryList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getPType(refresh: boolean = false) {
    let ptypeList = [];
    return this.http
      .get(this.apiUrl + "/getPTypeList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getAllUnitList(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getUnitList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getCounterProduct(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getCounterProductList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public cancelInvoice(vchrno: string, voucherType: string) {
    return this.http.post(this.apiUrl + "/cancelInvoice", { VCHRNO: vchrno, VOUCHERTYPE: voucherType }, this.getRequestOption())
      .map(res => res.json() || {})
  }


  getAccountObservable: Observable<TAcList[]>;

  public getAccount(calledFrom: string) {
    if (this._account.length > 0) {
      return Observable.of(this._account);
    } else if (this.getAccountObservable) {
      return this.getAccountObservable;
    } else {
      var aList: TAcList[] = [];
      this.getAccountObservable = this.http
        .get(this.apiUrl + "/getAccountList", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getAccountObservable = null;
          aList.push(<TAcList>data);
          this._account = aList;
          return aList.filter(x => x.TYPE == 'A');
        })
        .share();
      return this.getAccountObservable;
    }
  }
  public getCustomer(calledFrom: string) {
    if (this._account.length > 0) {
      return Observable.of(this._account);
    } else if (this.getAccountObservable) {
      return this.getAccountObservable;
    } else {
      var aList: TAcList[] = [];
      this.getAccountObservable = this.http
        .get(this.apiUrl + "/getAccountPayableList", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getAccountObservable = null;
          aList.push(<TAcList>data);
          this._account = aList;
          return aList.filter(x => x.TYPE == 'C');
        })
        .share();
      return this.getAccountObservable;
    }
  }



  public getAccoutFilteredObs(keyword: any, byacid: number = 0) {
    return new Observable((observer: Subscriber<TAcList[]>) => {
      this.getAccount("getAccountFilteredObs")
        .map(aclist => {
          if (byacid == 0) {
            return aclist.filter(ac =>
              ac.ACCODE == null
                ? ""
                : ac.ACCODE.toUpperCase().indexOf(keyword.toUpperCase()) > -1 && ac.TYPE == 'A'
            );
          } else {
            return aclist.filter(ac =>
              ac.ACNAME == null
                ? ""
                : ac.ACNAME.toUpperCase().indexOf(keyword.toUpperCase()) > -1 && ac.TYPE == 'A'
            );
          }
        })
        .subscribe(
          data => {
            observer.next(data);
          },
          Error => {
            observer.complete();
          },
          () => {
            observer.complete();
          }
        );
    });
  }


  public getMembershipList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getMembershipList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }





  public getOccupationList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getOccupationList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getDesignationList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getDesignationList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getMemberSchemeList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getMemberSchemeList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getSalesmanList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSalesmanList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getSchemeGroupList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSchemeGroupList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getSchemeList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getSchemeList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getJournalList(refresh: boolean = false) {

    return this.http
      .get(this.apiUrl + "/getJournalList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getProductGroupTree(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getProductGroupTree", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getACListTree(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getACListTree", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getUnits() {
    return this.http
      .get(this.apiUrl + "/getUnits", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getMCatList() {
    return this.http
      .get(this.apiUrl + "/getMCatList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getMCat1List() {
    return this.http
      .get(this.apiUrl + "/getMCat1List", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getMCat2List() {
    return this.http
      .get(this.apiUrl + "/getMCat2List", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getMCat3List() {
    return this.http
      .get(this.apiUrl + "/getMCat3List", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getRGroupList() {
    return this.http
      .get(this.apiUrl + "/getRGroupList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getWarehouseList() {
    return this.http
      .get(this.apiUrl + "/getWarehouseList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getApiList() {
    return this.http
      .get(this.apiUrl + "/getApiList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getCustomerList() {
    console.log("hello")
    return this.http
      .get(this.apiUrl + "/getAccountPagedListByPType/PA/C", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getCustomerList2(): Observable<any> {
    // console.log("hello")
    return this.http
      .get(this.apiUrl + "/getAccountPagedListByPType/PA/C", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getPTypeList() {
    return this.http
      .get(this.apiUrl + "/getPType", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getItemGroupList() {
    return this.http
      .get(this.apiUrl + "/getAllItemGroupList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getKotCategoryList() {
    return this.http
      .get(this.apiUrl + "/getKotCategoryList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getBCodeDetails() {
    return this.http
      .get(this.apiUrl + "/getBCodeDetails", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getBrandList() {
    return this.http
      .get(this.apiUrl + "/getBrandList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getModelList() {
    return this.http
      .get(this.apiUrl + "/getModelList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getSupplierListFromApi() {
    return this.http
      .get(this.apiUrl + "/getSupplierList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getSupplierList() {
    return this.getAccount("masterrepo-supplierlist").map((data: TAcList[]) => {
      let lst = data.filter(
        fil => fil.ACID.substr(0, 2) == "PA" && fil.PType == "V"
      );
      return lst;
    });
  }

  public getCustomers() {
    return this.getAccount("masterrepo-customerlist").map((data: TAcList[]) => {
      let lst = data.filter(
        fil => fil.ACID.substr(0, 2) == "PA" && fil.PType == "C"
      );
      return lst;
    });
  }

  public getCusSup() {
    return this.getAccount("masterrepo-customerlist").map((data: TAcList[]) => {
      let lst = data.filter(fil => fil.ACID.substr(0, 2) == "PA");
      return lst;
    });
  }

  public getCashList() {
    return this.getAccount("masterrepo-cashlist").map((data: TAcList[]) => {
      let lst = data.filter(
        fil => fil.ACID.substr(0, 2) == "AT" && fil.MAPID == "C"
      );
      return lst;
    });
  }

  public getBankList() {
    return this.getAccount("masterrepo-banklist").map((data: TAcList[]) => {
      let lst = data.filter(
        fil => fil.ACID.substr(0, 2) == "AT" && fil.MAPID == "B"
      );
      return lst;
    });
  }

  public getAcList() {
    return this.http
      .get(this.apiUrl + "/getAcList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  // public getCustomers() { return this.http.get(this.apiUrl + '/getCustomers', this.getRequestOption()).flatMap(response => response.json() || []); }
  // public getCashList() { return this.http.get(this.apiUrl + '/getCashList', this.getRequestOption()).flatMap(response => response.json() || []); }
  // public getBankList() { return this.http.get(this.apiUrl + '/getBankList', this.getRequestOption()).flatMap(response => response.json() || []); }
  public getPurchaseAcList() {
    return this.http
      .get(this.apiUrl + "/getPurchaseAcList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getSalesAcList() {
    return this.http
      .get(this.apiUrl + "/getSalesAcList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getCostCenterList() {
    return this.http
      .get(this.apiUrl + "/getCostCenterList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getSubLedgerList() {
    return new Observable((observer: Subscriber<TSubLedger[]>) => {
      if (this._subLedger.length == 0) {
        this.http
          .get(this.apiUrl + "/getSubLedgerList", this.getRequestOption())
          .flatMap(response => response.json() || [])
          .subscribe(
            res => {
              this._subLedger.push(<TSubLedger>res);
            },
            error => {
              observer.next([]);
            },
            () => {
              observer.next(this._subLedger);
            }
          );
      } else {
        observer.next(this._subLedger);
      }
    });
  }
  public getProductList() {
    return this.http
      .get(this.apiUrl + "/getProductList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getCashAndBankList() {
    return this.http
      .get(this.apiUrl + "/getCashAndBankList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  public getTrnMainList(prefix: string) {
    return this.http
      .get(this.apiUrl + "/getTrnMainList/" + prefix, this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getCurrentDate() {

    let date: Subject<any> = new Subject();
    this.http
      .get(this.apiUrl + "/getCurrentDate", this.getRequestOption())
      .subscribe(response => {
        date.next(response.json());
        date.unsubscribe();
      });
    return date;

  }

  public getBarcodeWiseProductForTran(barcode: string) {
    return this.http
      .get(
        this.apiUrl + "/getBarcodeWiseProductForTran/" + barcode,
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }
  public getProductForTran(mcode: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getProductForTran",
        { mcode: mcode },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getAccountTreeObservable: Observable<any[]>;

  public getacListTree() {
    if (this._accountTree.length > 0) {
      return Observable.of(this._accountTree);
    } else if (this.getAccountTreeObservable) {
      return this.getAccountTreeObservable;
    } else {
      this.getAccountTreeObservable = null;
      var atList: any[] = [];
      this.getAccountTreeObservable = this.http
        .get(this.apiUrl + "/getAccountTree", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getAccountTreeObservable = null;
          atList.push(<any>data);
          this._accountTree = atList;
          return atList;
        })
        .share();
      return this.getAccountTreeObservable;
    }
  }

  getPartyTreeObservable: Observable<any[]>;

  public getpartyListTree() {
    if (this._accountPartyTree.length > 0) {
      return Observable.of(this._accountPartyTree);
    } else if (this.getPartyTreeObservable) {
      return this.getPartyTreeObservable;
    } else {
      var apList: any[] = [];
      this.getPartyTreeObservable = this.http
        .get(this.apiUrl + "/getPartyListTree", this.getRequestOption())
        .flatMap(res => {
          if (res.status == 400) {
            return Observable.of([]);
          } else if (res.status == 200) {
            return res.json() || [];
          }
        })
        .map(data => {
          this.getPartyTreeObservable = null;
          apList.push(<any>data);
          this._accountPartyTree = apList;
          return apList;
        })
        .share();
      return this.getPartyTreeObservable;
    }
  }
  getAllAccount(ACID: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { ACID: ACID } };
    this.http
      .post(this.apiUrl + "/getAccount", bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  public saveTransaction(mode: string, trnmain: any, extra: any = null) {
    
    let couponValue = null;
    if (trnmain.TenderList && trnmain.TenderList.length > 0) {
      if (trnmain.TenderList != undefined) {
        trnmain.TenderList.filter(x => {
          if (x.TRNMODE == 'Coupon') {
            couponValue = x.REMARKS;
          }
        });
      }

    }

    try {
      console.log('in try')
      var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        "Saving data Please wait a moment..."
      );
      var message$: Observable<string> = messageSubject.asObservable();
      let childDialogRef = this.dialog.open(MessageDialog, {
        hasBackdrop: true,
        data: { header: "Information", message: message$ }
      });
      let res = { status: "error", result: "" };
      let returnSubject: Subject<any> = new Subject();
      let bodyData = {};
      if (extra == null) {
        bodyData = { mode: mode, data: trnmain };
      } else {
        bodyData = { mode: mode, data: trnmain, extra: extra };
      }
      console.log('bodydata', bodyData)





      this.http
        .post(
          this.apiUrl + "/saveTransaction",
          bodyData,
          this.getRequestOption()
        )
        .subscribe(
          data => {
            let retData = data.json();
            if (retData.status == "ok") {
              messageSubject.next("Data Saved Successfully");
              if (couponValue != "" && couponValue != undefined && couponValue != null) {
                this.updateUseFrquencyStatus(couponValue);
              }
              returnSubject.next(retData);
              setTimeout(() => {
                childDialogRef.close();
              }, 1000);
            } else {
              res.status = "error1";
              res.result = retData.result;
              childDialogRef.close();
              returnSubject.next(res);
            }
          },
          error => {
            childDialogRef.close();
            returnSubject.next({ status: "error", result: error });
          }
        );
      return returnSubject;
    } catch (ex) {
    }

  }





  public saveInterCompanyTransferInCancel(mode: string, trnmain: any, extra: any = null) {
    return this.http
      .post(
        this.apiUrl + "/saveTransaction",
        { mode: mode, data: trnmain, extra: extra },
        this.getRequestOption()
      )



  }

























  public updateUseFrquencyStatus(val) {
    console.log('updateUseFrquencyStatus', val);
    this.masterGetmethod(`/updateUseFrquencyStatus?couponValue=${val}`).subscribe(res => {
    });
  }



  public cancelPurchaseInvoice(mode: string, trnmain: any, extra: any = null) {
    try {

      let res = { status: "error", result: "" };
      let returnSubject: Subject<any> = new Subject();
      let opt = this.getRequestOption();
      let hd: Headers = new Headers({ "Content-Type": "application/json" });
      let op: RequestOptions = new RequestOptions();
      let bodyData = {};
      if (extra == null) {
        bodyData = { mode: mode, data: trnmain };
      } else {
        bodyData = { mode: mode, data: trnmain, extra: extra };
      }

      this.http
        .post(
          this.apiUrl + "/saveTransaction",
          bodyData,
          this.getRequestOption()
        )
        .subscribe(
          data => {
            let retData = data.json();
            if (retData.status == "ok") {
              returnSubject.next(retData);
            } else {
              res.status = "error1";
              res.result = retData.result;
              returnSubject.next(res);
            }
          },
          error => {
            returnSubject.next({ status: "error", result: error });
          }
        );
      return returnSubject;
    } catch (ex) {
    }
  }

  public saveStockSettlement(mode: string, trnmain: any, extra: any = null) {
    try {
      var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        "Saving data Please wait a moment..."
      );
      var message$: Observable<string> = messageSubject.asObservable();
      let childDialogRef = this.dialog.open(MessageDialog, {
        hasBackdrop: true,
        data: { header: "Information", message: message$ }
      });
      let res = { status: "error", result: "" };
      let returnSubject: Subject<any> = new Subject();
      let opt = this.getRequestOption();
      let hd: Headers = new Headers({ "Content-Type": "application/json" });
      let op: RequestOptions = new RequestOptions();
      let bodyData = {};
      if (extra == null) {
        bodyData = { mode: mode, data: trnmain };
      } else {
        bodyData = { mode: mode, data: trnmain, extra: extra };
      }

      this.http
        .post(
          this.apiUrl + "/saveStockSettlement",
          bodyData,
          this.getRequestOption()
        )
        .subscribe(
          data => {
            let retData = data.json();
            if (retData.status == "ok") {
              messageSubject.next("Data Saved Successfully");
              returnSubject.next(retData);
              setTimeout(() => {
                childDialogRef.close();
              }, 1000);
            } else {
              res.status = "error1";
              res.result = retData.result;
              messageSubject.next(res.result);
              setTimeout(() => {
                childDialogRef.close();
                returnSubject.next(res);
              }, 3000);
            }
          },
          error => {
            messageSubject.next(error.json());
            this.resolveError(error, "saveStockSettlement");
            setTimeout(() => {
              childDialogRef.close();
              returnSubject.next({ status: "error", result: error });
            }, 3000);
          }
        );
      return returnSubject;
    } catch (ex) {
      //alert(ex);
    }
  }

  public saveStockSettlementApproval(mode: string, trnmain: any, extra: any = null) {
    try {
      var messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
        "Saving data Please wait a moment..."
      );
      var message$: Observable<string> = messageSubject.asObservable();
      let childDialogRef = this.dialog.open(MessageDialog, {
        hasBackdrop: true,
        data: { header: "Information", message: message$ }
      });
      let res = { status: "error", result: "" };
      let returnSubject: Subject<any> = new Subject();
      let opt = this.getRequestOption();
      let hd: Headers = new Headers({ "Content-Type": "application/json" });
      let op: RequestOptions = new RequestOptions();
      let bodyData = {};
      if (extra == null) {
        bodyData = { mode: mode, data: trnmain };
      } else {
        bodyData = { mode: mode, data: trnmain, extra: extra };
      }
      this.http
        .post(
          this.apiUrl + "/saveApprovalStockSettlement",
          bodyData,
          this.getRequestOption()
        )
        .subscribe(
          data => {
            let retData = data.json();
            if (retData.status == "ok") {
              messageSubject.next("Data Saved Successfully");
              returnSubject.next(retData);
              setTimeout(() => {
                childDialogRef.close();
              }, 1000);
            } else {
              res.status = "error1";
              res.result = retData.result;
              messageSubject.next(res.result);
              setTimeout(() => {
                childDialogRef.close();
                returnSubject.next(res);
              }, 3000);
            }
          },
          error => {
            messageSubject.next(error.json());
            this.resolveError(error, "saveStockSettlement");
            setTimeout(() => {
              childDialogRef.close();
              returnSubject.next({ status: "error", result: error });
            }, 3000);
          }
        );
      return returnSubject;
    } catch (ex) {
      //alert(ex);
    }
  }






  public saveUnit(mode: string, trnmain: any, unit: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: trnmain, extra: unit };
    this.http
      .post(this.apiUrl + "/saveUnit", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
          }
        },
        error => {
          var er = error.json();
          returnSubject.next(er);
        }
      );
    return returnSubject;
  }
  public saveChanel(mode: string, trnmain: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: trnmain };
    this.http
      .post(this.apiUrl + "/saveChanel", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
          }
        },
        error => {
          var er = error.json();
          returnSubject.next(er);
        }
      );
    return returnSubject;
  }

  public saveSalesTerminal(mode: string, salesTerminal: any, cpList: any[]) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = {
      mode: mode,
      data: salesTerminal,
      CounterProductList: cpList
    };
    this.http
      .post(
        this.apiUrl + "/saveSalesTerminal",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveClaimType(mode: string, claimType: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: claimType };
    this.http
      .post(this.apiUrl + "/saveClaimType", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveWarehouse(mode: string, warehouse: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: warehouse };
    this.http
      .post(this.apiUrl + "/saveWarehouse", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveOrganizationHierarchy(mode: string, warehouse: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: warehouse };
    this.http
      .post(
        this.apiUrl + "/saveOrganizationHierarchy",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public saveSalesManType(mode: string, salesmanType: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: salesmanType };
    this.http
      .post(
        this.apiUrl + "/saveSalesmanType",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public saveSalesman(mode: string, salesman: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: salesman };
    this.http
      .post(this.apiUrl + "/saveSalesman", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public savePType(mode: string, salesman: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: salesman };
    this.http
      .post(this.apiUrl + "/savePType", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveProduct(
    mode: string,
    prodObj: any,
    RGLIST: any[],
    AlternateUnits: any[],
    PBarCodeCollection: any[],
    BrandModelList: any[],
    categoryDetail: any[],
    variantCombination: any[]
  ) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = {
      mode: mode,
      data: {
        product: prodObj,
        rglist: RGLIST,
        alternateunits: AlternateUnits,
        bcodeList: PBarCodeCollection,
        bmList: BrandModelList,
        categoryDetail: categoryDetail,
        variantCombination: variantCombination
      }
    };

    var data = JSON.stringify(bodyData);
    this.http
      .post(
        this.apiUrl + "/saveProductMaster",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public saveProducts(body) {

    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = {
      data: body,
      mode: "add"
    }
    this.http
      .post(
        this.apiUrl + "/saveProductMaster",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }






  public saveMembership(mode: string, membership: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: membership };
    this.http
      .post(this.apiUrl + "/saveMembership", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveDivision(division: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    this.http
      .post(this.apiUrl + "/saveDivision", division, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveCostCenter(mode: string, costCenter: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: costCenter };
    this.http
      .post(this.apiUrl + "/saveCostCenter", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public loadCompany(targetCompanyId) {
    return new Observable((observer: Subscriber<Company>) => {
      let res = { status: "error", result: "" };
      this.http
        .get(this.apiUrl + "/loadCompanyInfo?targetCompanyId=" + targetCompanyId, this.getRequestOption())
        .map(ret => ret.json())
        .subscribe(
          data => {
            observer.next(data.result);
          },

          error => {
            let ret = this.resolveError(error, "loadcompany");
            if (ret == "Login resolved") {
              this.loadCompany(targetCompanyId);
              return;
            }
            observer.next(null);
            observer.complete();
          }
        );
    });
  }
  public saveCompany(mode: string, costCenter: any, targetCompanyId: any) {


    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: costCenter };
    this.http
      .post(this.apiUrl + "/saveCompanyInfo?targetCompanyId=" + targetCompanyId, bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;


            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          let ret = this.resolveError(error, "savecompany");

          returnSubject.next(error);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveCategory(mode: string, category: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: category };
    this.http
      .post(this.apiUrl + "/saveCategory", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveAccount(mode: string, Account: any, SOLIST: any[] = []) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: Account, SOList: SOLIST };
    this.http
      .post(this.apiUrl + "/saveAccount", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveAccount_new(Account: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();

    this.http
      .post(this.apiUrl + "/saveAccount", Account, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getFiscalYearList() {
    return this.http
      .get(this.apiUrl + "/fiscalYear", this.getRequestOption())
      .map(data => data.json())
      .share();
  }
  public getWarehousesList() {
    return this.http
      .get(this.apiUrl + "/warehouseList", this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  public LoadInterCompanyTransfer(vchrno: string, division: string, phiscalID: string, FROMCOMPANY: string, transactionMode: string = "NEW") {
    let bodyData = { VCHRNO: vchrno, DIVISION: division, PHISCALID: phiscalID, MODE: transactionMode, FROMCOMPANY: FROMCOMPANY };
    return this.http
      .post(this.apiUrl + "/getInterCompanyTransferredOutForIn", bodyData, this.getRequestOption())
      .map(data => data.json())
      .share();
  }


  //to load the vouher in trnmain. this is common function to load voucher
  public LoadTransaction(vchrno: string, division: string, phiscalID: string, transactionMode: string = "NEW") {
    let bodyData = { VCHRNO: vchrno, DIVISION: division, PHISCALID: phiscalID, MODE: transactionMode };

    return this.http
      .post(this.apiUrl + "/getViewVoucher", bodyData, this.getRequestOption())
      .map(data => data.json())
      .share();
  }



  public getInvoiceData(vchrno: string, division: string, phiscalID: string, parac: string, tag: string = '', refbill: string = "", trnmode: string = "") {

    let bodyData = { VCHRNO: vchrno, DIVISION: division, PHISCALID: phiscalID, PARAC: parac, tag: tag, REFBILL: refbill, TRNMODE: trnmode };
    return this.http
      .post(this.apiUrl + "/getInvoiceData", bodyData, this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  public saveMultiMobileSO(listOfVouchers: any, tag: string = "") {
    return this.http
      .post(`${this.apiUrl}/saveMultipleTransaction?tag=${tag}`, listOfVouchers, this.getRequestOption())
      .map(data => data.json())
      .share();
  }


  public getMobileOrderFilteredDateWise(from, to) {
    return this.http
      .get(`${this.apiUrl}/getMobileOrderFilteredDateWise?From=${from}&To=${to}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }
  public saveSchemeManualNew(data: any) {
    return this.http
      .post(this.apiUrl + "/saveSchemeManualNew", data, this.getRequestOption())
      .map(data => data.json())
      .share();
  }
  public saveSchemeFromExcel(data: any, file: File) {
    let formData: FormData = new FormData();

    if (file) {
      formData.append('file', file, file.name);
    }
    formData.append('data', JSON.stringify(data))
    return this.http
      .post(this.apiUrl + "/saveSchemeFromExcelNew", formData, this.filegetRequestOption())
      .map(data => data.json())
      .share();



  }


  private filegetRequestOption() {
    let headers: Headers = new Headers({
      'mimeType': "multipart/form-data",
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers });
  }



  public getReprintData(vchrno: string, division: string, phiscalID: string, trnUser: string, voucherPrefix: string, posPrintCount: number = 1, printmode: number = 0) {
    return this.http
      .get(this.apiUrl + `/getReprintData?VCHRNO=${vchrno}&DIVISION=${division}&PHISCALID=${phiscalID}&TRNUSER=${trnUser}&COUNT=${posPrintCount}&PRINTMODE=${printmode}&VOUCHERPREFIX=${voucherPrefix}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  public download3mmsalesinvoicepdf(vchrno: string) {
    return this.http
      .get(this.apiUrl + `/download3mmsalesinvoicepdf?vchrno=${vchrno}`, this.getRequestOption())
      .map(data => data.json())
      .share();
  }



  public LoadStockSettlement(vchrno: string, apiEndpoint: string) {
    let bodyData = { VCHRNO: vchrno };
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + `/${apiEndpoint}`, bodyData, this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();

          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;


  }






  public getPrefixVname(vtype: VoucherTypeEnum) {

    switch (vtype) {
      case 12:
        return "JV";
      case 17:
        return "PV";
      case 18:
        return "RV";
      case 3:
        return "PI";
      case 1:
        return "SI";
      case 14:
        return "TI";
      case 5:
        return "IS";
      case 15:
        return "CN";
      case 16:
        return "DN";
      case 7:
        return "TR";
      case 8:
        return "TO";
      case 13:
        return "DL";
      case 2:
        return "SR";
      case 21:
        return "DR";
      case 9:
        return "DM";
      default:
        return "00";
    }
  }

  public checkUserValid() {
    return new Observable((observer: Subscriber<boolean>) => {
      this.http
        .get(this.apiUrl + "/checkLogin", this.getRequestOption())
        .subscribe(
          data => {
            this.state.setGlobalSetting("LoggedIn", ["true"]);
            observer.next(true);
            observer.complete();
          },
          Error => {
            observer.next(false);
            observer.complete();
          },
          () => {
            observer.complete();
          }
        );
    });
  }

  public IsLoginDialogOpened: boolean = false;
  public resolveError(error: any, callFrom: string) {
    try {
      let dialogResult;
      if (error.statusText == "Unauthorized") {
        if (this.IsLoginDialogOpened == true) {
          return;
        }
        this.IsLoginDialogOpened = true;
        let dialogRef = this.dialog.open(LoginDialog, { disableClose: true });
        dialogRef.afterClosed().subscribe(result => {
          this.IsLoginDialogOpened = false;
        });
        return null;
      }
      let err = error;
      if (
        err &&
        err == "The ConnectionString property has not been initialized."
      ) {
        if (this.IsLoginDialogOpened == true) {
          return;
        }
        this.IsLoginDialogOpened = true;
        let dialogRef = this.dialog.open(LoginDialog, { disableClose: true });
        dialogRef.afterClosed().subscribe(result => {
          this.IsLoginDialogOpened = false;
        });
        return null;
      }
      return err;
    } catch (ex) {
      alert({ callfrom: callFrom, catchError: ex });
    }
  }

  public saveClientTerminal(mode: string, value: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: value };
    this.http
      .post(
        this.apiUrl + "/saveClientTerminal",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  getSingleObject(postData, postUrl: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: postData };
    this.http
      .post(this.apiUrl + postUrl, bodyData, this.getRequestOption())
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getList(data, url) {

    return this.http
      .post(this.apiUrl + url, data, this.getRequestOption())
      .map(data => data.json())
      .share();
  }
  public getSalesModeList(postobj) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = postobj;
    this.http
      .post(
        this.apiUrl + "/getSalesModeList",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  private _receipeitemList: any[] = [];
  public _receipeitemListObservable$: Observable<any[]>;
  public getReceipeItemList(refreshFromDatabase: boolean = false) {
    try {
      if (this._receipeitemList.length > 0 && refreshFromDatabase == false) {
        return Observable.of(this._receipeitemList);
      } else if (
        this._receipeitemListObservable$ &&
        refreshFromDatabase == false
      ) {
        return this._receipeitemListObservable$;
      } else {
        this._receipeitemListObservable$ = null;
        this._receipeitemList = [];
        this._receipeitemListObservable$ = this.http
          .post(
            this.apiUrl + "/getReceipeItemList",
            { EDATE: this._lastProductChangeDateLocal },
            this.getRequestOption()
          )
          .flatMap(res => res.json() || [])
          .map(data => {
            this._receipeitemList.push(<any>data);
            return this._receipeitemList;
          })
          .share();
        return this._receipeitemListObservable$;
      }
    } catch (ex) {
    }
  }
  public saveObject(mode: string, value: any, url: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: value };
    this.http
      .post(this.apiUrl + url, bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  getParentWiseProduct(MCODE: string) {
    alert("MCODE" + MCODE);
    return this.http
      .get(
        this.apiUrl + "/getParentWiseProduct/" + MCODE,
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }
  public getTreeForSchemeDiscount_MGroup() {
    return this.http
      .get(
        this.apiUrl + "/getTreeForSchemeDiscount_MGroup",
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }
  public getTreeForSchemeDiscount_Parent() {
    return this.http
      .get(
        this.apiUrl + "/getTreeForSchemeDiscount_Parent",
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }

  public saveschedule(mode: string, Account: any) {

    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();

    let opt = this.getRequestOption();

    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: Account };
    this.http
      .post(this.apiUrl + "/saveschedule", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();

          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;

            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAllSchedule() {
    return this.http
      .get(this.apiUrl + "/getSchedule", this.getRequestOption())
      .map(response => response.json() || []);
  }
  public getAllSchedule1() {
    return this.http
      .get(this.apiUrl + "/getSchedule", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  // public saveScheme(
  //   mode: string,
  //   Account: any[],
  //   Flag,
  //   data: any,
  //   rangeList: any[]
  // ) {
  //   let res = { status: "error", result: "" };
  //   let returnSubject: Subject<any> = new Subject();
  //   let opt = this.getRequestOption();
  //   let hd: Headers = new Headers({ "Content-Type": "application/json" });
  //   let op: RequestOptions = new RequestOptions();
  //   let bodyData = {
  //     mode: mode,
  //     data: data,
  //     dataList: Account,
  //     flag: Flag,
  //     dataRange: rangeList
  //   };
  //   this.http
  //     .post(this.apiUrl + "/schemeSave", bodyData, this.getRequestOption())
  //     .subscribe(
  //       data => {
  //         let retData = data.json();
  //         if (retData.status == "ok") {
  //           res.status = "ok";
  //           res.result = retData.result;
  //           returnSubject.next(res);
  //           returnSubject.unsubscribe();
  //         } else {
  //           res.status = "error1";
  //           res.result = retData.result;
  //           returnSubject.next(res);
  //           returnSubject.unsubscribe();
  //         }
  //       },
  //       error => {
  //         (res.status = "error2"), (res.result = error);
  //         returnSubject.next(res);
  //         returnSubject.unsubscribe();
  //       }
  //     );
  //   return returnSubject;
  // }
  public saveScheme(
    mode: string,
    schemeObj: any
  ) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    const options = { headers: this.getRequestOption(), method: 'post' }

    let bodyData = {
      mode: mode,
      data: schemeObj
    };
    // ,options
    this.http
      .post(this.apiUrl + "/schemeSave", bodyData, this.getRequestOption()).map(res => res.json())
      .subscribe(
        (data: any) => {
          let retData = data;
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public saveComboList(comboList: any[]) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { data: comboList };
    this.http
      .post(this.apiUrl + "/saveComboList", comboList, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getSelectedComboList(Initial: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { DisID: Initial } };
    alert("getSelectedComboList");
    this.http
      .post(
        this.apiUrl + "/GETSelectedComboList",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  getAllSchemeList(Initial: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { DisID: Initial } };
    this.http
      .post(
        this.apiUrl + "/GetAllSchemeList",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  public getAllScheme() {
    return this.http
      .get(this.apiUrl + "/GetAllScheme", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  getParentWiseProductforScheme(MCODE: string) {
    return this.http
      .get(
        this.apiUrl + "/getParentWiseProductforScheme/" + MCODE,
        this.getRequestOption()
      )
      .flatMap(response => response.json() || []);
  }
  private _comboList: any[] = [];
  public _ComboListObservable$: Observable<any[]>;
  public getComboList() {
    try {
      if (this._comboList.length > 0) {
        return Observable.of(this._comboList);
      } else if (this._ComboListObservable$) {
        return this._ComboListObservable$;
      } else {
        this._ComboListObservable$ = null;
        this._ComboListObservable$ = this.http
          .post(
            this.apiUrl + "/GETcombolist",
            { EDATE: this._lastProductChangeDateLocal },
            this.getRequestOption()
          )
          .flatMap(res => res.json() || [])
          .map(data => {
            this._comboList.push(<any>data);
            return this._comboList;
          })
          .share();
        return this._ComboListObservable$;
      }
    } catch (ex) {
    }
  }

  getComboIdWise(CID: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getItemfromComboId",
        { CID: CID },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  getWarehouseWiseCounterProduct(value) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();

    this.http
      .post(
        this.apiUrl + "/getWarehouseWiseCounterProduct",
        value,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  checkConsumptionDate(a: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/checkConsumptionEntryDate",
        { CID: a },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  // List
  getConsumptionList(a: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getConsumptionEntryList",
        { CID: a },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  public SaveConsumptionEntry(mode: string, List: any[], TRN: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { mode: mode, data: List, data2: TRN };
    this.http
      .post(this.apiUrl + "/saveConsumption", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  //Table
  public getAllConsumption() {
    return this.http
      .get(this.apiUrl + "/getAllConsumption", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  getConsumptionFromID(CID: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getConsumptionFromID",
        { CID: CID },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }
  getAllMcodeNAME() {
    return this.http
      .get(this.apiUrl + "/getAllMcodeNAME", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  getAllSettlement() {
    return this.http
      .get(this.apiUrl + "/getAllSettlement", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  getSettlementMode() {
    return this.http
      .get(this.apiUrl + "/getSettlementMode", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }
  getStockSettlementFromID(CID: string) {
    let res = { status: "error", result: "" };
    let returnItemSubject: Subject<any> = new Subject();
    this.http
      .post(
        this.apiUrl + "/getStockSettlementFromID",
        { CID: CID },
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          } else {
            returnItemSubject.next(data);
            returnItemSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnItemSubject.next(res);
          returnItemSubject.unsubscribe();
        }
      );
    return returnItemSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  public saveBatch(value: any, url: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { data: value };
    this.http
      .post(this.apiUrl + url, bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  getReportData(dataToSave, postUrl) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();

    this.http
      .post(this.apiUrl + postUrl, dataToSave, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );

    return returnSubject;
  }

  //Additional Cost Service
  saveAdditionalCost(saveObj: any): any {
    let res = { status: "error", result: "" };
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { saveObj };
    alert("masterService!!" + JSON.stringify(bodyData));
    this.http
      .post(
        this.apiUrl + "/saveAdditionalCost",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(res => {
      });
  }

  //Additional Cost Service Ends

  masterGetmethod(geturl) {
    let res = { status: "error", result: "", message: "error", RefNo: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    this.http.get(this.apiUrl + geturl, this.getRequestOption()).subscribe(
      data => {
        let retData = data.json();
        if (retData.status == "ok") {
          res.status = "ok";
          res.result = retData.result;
          res.message = retData.message;
          res.RefNo = retData.RefNo;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        } else {
          res.status = "error";
          res.result = retData.result;
          res.message = retData.message;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      },
      error => {
        (res.status = "error2"), (res.result = error);
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
    );
    return returnSubject;
  }


  masterPostmethod(posturl, data) {
    let res = { status: "error", result: "", result2: "", message: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();

    this.http
      .post(this.apiUrl + posturl, data, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            res.result2 = retData.result2;
            res.message = retData.message;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error";
            res.result = retData.result;
            res.message = retData.message;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error), (res.message = error._body);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }




  masterPostmethod_NEW(posturl, data) {
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();

    return this.http
      .post(this.apiUrl + posturl, data, this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  masterGetmethod_NEW(posturl) {
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();

    return this.http
      .get(this.apiUrl + posturl, this.getRequestOption())
      .map(data => data.json())
      .share();
  }


  getPRNData(posturl) {

    return this.http
      .get(this.apiUrl + posturl, this.getRequestOption())
  }
  showmessagedialog(message) {
    let dialogRef = this.dialog.open(MessageDialog, message);
    setTimeout(() => {
      this.dialog.closeAll();
    }, 5000);
  }
  public getAllBranch(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllBranchList", this.getRequestOption())
      .flatMap(response => response.json() || []);
  }

  public getAllChanel(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllChanelList", this.getRequestOption())
      .map(response => response.json() || []);
  }
  public getAllSalesHierarchyParent(refresh: boolean = false) {
    return this.http
      .get(
        this.apiUrl + "/getAllSalesHierarchyParentList",
        this.getRequestOption()
      )
      .map(response => response.json() || []);
  }

  public getAllProductHierarchyParent(refresh: boolean = false) {
    return this.http
      .get(
        this.apiUrl + "/getAllProductHierarchyParentList",
        this.getRequestOption()
      )
      .map(response => response.json() || []);
  }
  public getAllChannelParent(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllChanelParentList", this.getRequestOption())
      .map(response => response.json() || []);
  }
  public getAllProductCategoryLine(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getProdcutCategoryLineList", this.getRequestOption())
      .map(response => response.json() || []);
  }
  public getAllRouteMasterName(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getAllRouteMasterList", this.getRequestOption())
      .map(response => response.json() || []);
  }

  public getAllDivisionList(refresh: boolean = false) {
    return this.http
      .get(this.apiUrl + "/getDivisionList", this.getRequestOption())
      .map(response => response.json() || []);
  }

  public cancelRecallbill(billNo: number, phiscalID: string) {
    return this.http
      .post(this.apiUrl + "/cancelRecallbill", { SNO: billNo, PhiscalID: phiscalID }, this.getRequestOption())
      .map(response => response.json() || []);
  }




  getitemfromMenuCat(MENUCAT: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: "query", data: { MCAT: MENUCAT } };
    this.http
      .post(
        this.apiUrl + "/getitemfromMenuCat",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }


  getStockList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        this.apiUrl + "/getStock/" + this._lastProductStockCheckDateLocal,
        this.getRequestOption()
      )
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            // this._lastProductStockCheckDateLocal=new Date();
            //   this.getCurrentDate().subscribe(date => {
            //     this.authService.setSessionVariable("LastProductStockCheckDateLocal",date.Date);  }, error => {

            // });

            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          (res.status = "error2"), (res.result = error);
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  getPCL() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + "/getPCL", this.getRequestOption()).subscribe(
      response => {
        let data = response.json();
        if (data.status == "ok") {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        } else {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
      },
      error => {
        res.status = "error";
        res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
    );
    return returnSubject;
  }




  loadSalesInvoiceFromSalesOrder(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/GetSODetailForSaleInvoice?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  SelectedDeliveryChallaan(voucerNo: string, FROMCOMPANYID: string, division: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getHOTDeliveryChallaanDetail?voucherNo=${voucerNo}&fromcompanyid=${FROMCOMPANYID}&division=${division}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  SelectedMR(voucerNo: string, FROMCOMPANYID: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getHOTMRDetail?voucherNo=${voucerNo}&fromcompanyid=${FROMCOMPANYID}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();

          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  loadSalesInvoiceFromSupplierHO(voucerNo: string, FROMCOMPANYID: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getHOTaxInvoiceDetail?voucherNo=${voucerNo}&fromcompanyid=${FROMCOMPANYID}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  loadSAPPurchaseInvoiceDetail(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getSAPPurchaseInvoiceDetail?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }



  loadHoPerformaInvoice(voucerNo: string, fromCompany: string = null, adddeliveryCharge = false) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getHOPerformaInvoice?voucherNo=${voucerNo}&fromCompany=${fromCompany}&adddeliveryCharge=${adddeliveryCharge}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {

          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  loadHoDeliveryChallaan(voucerNo: string, division: string, phiscalID: string, transactionMode: string = "NEW") {
    let bodyData = { "VCHRNO": voucerNo, "DIVISION": division, "PHISCALID": phiscalID, "MODE": transactionMode };

    return this.http
      .post(this.apiUrl + "/getHODeliveryChallaan", JSON.stringify(bodyData), this.getRequestOption())
      .map(data => data.json())
      .share();
  }

  rejectPerformaInvoice(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/RejectHOPerformaInvoice?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  loadHoPurchaseOrder(voucerNo: string, FromCompanyid: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getHOPurchaseOrder?voucherNo=${voucerNo}&fromcompanyid=${FromCompanyid}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  loadHoPurchaseOrderFromMobile(orderid: string, orderfrom: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getPurchaseOrderFromMobileApi?orderid=${orderid}&orderfrom=${orderfrom}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  loadPurchaseOrderForPOCancel(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/getPurchaseOrderForPOCancel?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  public getAllSalesManTypeList(refresh: boolean = false) {
    return this.http.get(this.apiUrl + '/getAllSalesmanTypeList', this.getRequestOption())
      .map(response => response.json() || [])
  }

  approvePerformaInvoice(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/ApproveHOPerformaInvoice?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }

  approveStockSettlement(voucerNo: string) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http
      .get(
        `${this.apiUrl}/saveTransaction?voucherNo=${voucerNo}`,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }



  TenderTypes() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/GetTenderTypes', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  public getAllExcelImportMasterList(refresh: boolean = false) {
    return this.http.get(this.apiUrl + '/getExcelConfigMasterList', this.getRequestOption())
      .map(response => response.json() || [])
  }


  public getAllWarehouseLists(refresh: boolean = false) {
    return this.http.get(this.apiUrl + '/WarehouseList', this.getRequestOption())
      .map(response => response.json() || [])
  }

  getState() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getStates', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }
  getAllHierachy() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getAllHierachy', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }
  GETTRNTYPE() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getTrnType', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }
  getGenericGridPopUpSettings(VoucherPrefix) {

    if (VoucherPrefix == "PODataFromQuotations") {
      return {
        title: "Approved Quotations",
        apiEndpoints: `/GetApprovedQuotationsForPO`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'RFQNO',
            title: 'RFQNO',
            hidden: false,
            nosearch: false
          },
          {
            key: 'SupplierName',
            title: 'Supplier Name',
            hidden: false,
            nosearch: false
          },
          {
            key: 'RFQDate',
            title: 'RFQ Date',
            hidden: false,
            nosearch: false
          },
          {
            key: 'QTApprovalDate',
            title: 'QT Approval Date',
            hidden: false,
            nosearch: false
          },
          {
            key: 'supplieracid',
            title: 'supplieracid',
            hidden: true,
            nosearch: false
          }

        ]
      };

    }

    if (VoucherPrefix == "OP") {
      return {

        title: "Opening Entries",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'TDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    if (VoucherPrefix == "PP") {
      return {
        title: "Performa Invoice",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'CUSTOMER',
            hidden: true,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'PERFORMA NO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          // {
          //   key: 'PARAC',
          //   title: 'CUSTOMER',
          //   hidden: false,
          //   noSearch: false
          // },
          {
            key: 'TRNSTATUS',
            title: 'Status',
            hidden: false,
            noSearch: true
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: true,
            noSearch: false
          },
        ]
      };
    }
    if (VoucherPrefix == "DY") {
      return {
        title: "Delivery Challaan",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'CUSTOMER',
            hidden: true,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'Challaan. NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          // {
          //   key: 'PARAC',
          //   title: 'CUSTOMER',
          //   hidden: false,
          //   noSearch: false
          // },
          {
            key: 'TRNSTATUS',
            title: 'Status',
            hidden: false,
            noSearch: true
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: true,
            noSearch: false
          },
        ]
      };
    }
    if (VoucherPrefix == "CN" || VoucherPrefix == "DN") {
      return {
        title: VoucherPrefix == "CN" ? "Sales Return" : "Purchase Return",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'CUSTOMER',
            hidden: true,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VOUCHERREMARKS',
            title: 'TYPE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: true
          }
        ]
      };
    }
    if (VoucherPrefix == "SO") {
      return {
        title: "Sales Orders",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'ACNAME',
            title: 'Customer.',
            hidden: true,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'SONO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'CREATION_TYPE',
            title: 'TYPE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: true
          },
        ]
      };
    }
    if (VoucherPrefix == "PO") {
      return {
        title: "Purchase Orders",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'VCHRNO',
            title: 'PONO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: true
          }
        ]
      };

    }

    if (VoucherPrefix == "PI") {
      return {
        title: "Purchase Invoices",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'supplier',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'GRNNO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'INVOICE NO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'IDATE',
            title: 'INVOICE DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TDATE',
            title: 'GRN DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: true
          }
        ]
      };
    }

    if (VoucherPrefix == "MR") {
      return {
        title: "Material Receipts",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'VCHRNO',
            title: 'MRNO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'INVOICE NO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'IDATE',
            title: 'INVOICE DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TDATE',
            title: 'GRN DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: true
          }
        ]
      };
    }

    if (VoucherPrefix == "REFBILLOFSALESRETURN") {
      return {
        title: "Bill Details",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'CUSTOMER',
            hidden: true,
            noSearch: false
          },
          {
            key: 'BILLTOMOB',
            title: 'MOBILE',
            hidden: true,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'BILL NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNMODE',
            title: 'TYPE',
            hidden: false,
            noSearch: false
          },

          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'INVOICETYPE',
            title: 'INVOICE TYPE',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }
    if (VoucherPrefix == "REFBILLOFPURCHASERETURN") {
      return {
        title: "Bill Details",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'CUSTOMER',
            hidden: true,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'BILL NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'Supplier Bill NO',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNMODE',
            title: 'TYPE',
            hidden: false,
            noSearch: false
          },

          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    if (VoucherPrefix == "itemlist") {
      return {
        title: "Sales Orders",
        apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'VCHRNO',
            title: 'SONO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNMODE',
            title: 'TYPE',
            hidden: false,
            noSearch: false
          },
        ]
      };
    }
    if (VoucherPrefix == "HOLDBILLLIST") {
      return {
        title: "Hold Bills",
        apiEndpoints: `/recallallholdbill`,
        defaultFilterIndex: 0,
        showActionButton: true,
        actionKeys: [{
          icon: "fa fa-trash",
          text: "cancel",
          title: "Click to Cancel HoldBill."
        }],
        columns: [
          {
            key: 'ACNAME',
            title: 'Customer',
            hidden: false,
            noSearch: false
          },
          {
            key: 'SNO',
            title: 'Bill No',
            hidden: false,
            noSearch: false
          },
          {
            key: 'DATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          }
          ,
          {
            key: 'USER',
            title: 'USER',
            hidden: false,
            noSearch: false
          },
          {
            key: 'PhiscalID',
            title: 'PhiscalId',
            hidden: true,
            noSearch: true
          }
        ]
      };

    }
    if (VoucherPrefix == "RI") {
      // alert("reache23")
      return {
        title: "Indent Request",
        apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'INDENTNO',
            title: 'Indent No.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'DATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },

        ]
      };
    }
    if (VoucherPrefix == "Transporter") {
      return {
        title: "Transporter Name",
        apiEndpoints: `/getTransportFromMaster/${VoucherPrefix}`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'NAME',
            title: 'Name',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ADDRESS',
            title: 'Address',
            hidden: false,
            noSearch: false
          }

        ]
      };
    }
    // if (VoucherPrefix == "LOYALTY"){
    //   return {
    //     title: "Loyalty Name",
    //     apiEndpoints: `/getTransportFromMaster/${VoucherPrefix}`,
    //     defaultFilterIndex: 0,
    // }
    if (VoucherPrefix == "INDENTLIST") {
      return {
        title: "Indent List For PO",
        // apiEndpoints: `/getAllIndentPagedListForPO`,
        apiEndpoints: `/getAllIndentPagedListForEdit`,

        defaultFilterIndex: 0,
        columns: [
          {
            key: 'INDENTNO',
            title: 'Indent No.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: false
          },

        ]
      };
    }
    if (VoucherPrefix == "RFQINDENTLIST") {
      return {
        title: "Indent List For RFQ",
        // apiEndpoints: `/getAllIndentPagedListForPO`,
        apiEndpoints: `/getAllIndentPagedListForRFQ`,

        defaultFilterIndex: 0,
        columns: [
          {
            key: 'INDENTNO',
            title: 'Indent No.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: false
          },
          {
            key: 'RFQVOUCHERNO',
            title: 'RFQVOUCHERNO',
            hidden: false,
            noSearch: false
          },

        ]
      };

    }
    if (VoucherPrefix == "TI") {
      return {
        title: "Vouchers",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'CUSTOMER',
            hidden: true,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: this.appSetting.enableMultiSeriesInSales == 1 ? true : false,
            noSearch: this.appSetting.enableMultiSeriesInSales == 1 ? true : false
          },
          {
            key: 'CHALANNO',
            title: 'VOUCHER NO.',
            hidden: this.appSetting.enableMultiSeriesInSales == 1 ? false : true,
            noSearch: this.appSetting.enableMultiSeriesInSales == 1 ? false : true
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: true
          },
          {
            key: 'TRNMODE',
            title: 'INVOICE TYPE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    if (VoucherPrefix == "IC") {
      return {
        title: "Vouchers",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'CUSTOMER',
            hidden: true,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: this.appSetting.enableMultiSeriesInSales == 1 ? true : false,
            noSearch: this.appSetting.enableMultiSeriesInSales == 1 ? true : false
          },
          {
            key: 'CHALANNO',
            title: 'VOUCHER NO.',
            hidden: this.appSetting.enableMultiSeriesInSales == 1 ? false : true,
            noSearch: this.appSetting.enableMultiSeriesInSales == 1 ? false : true
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: true
          },
          {
            key: 'TRNMODE',
            title: 'INVOICE TYPE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    if (VoucherPrefix == "IR") {
      return {
        title: "Vouchers",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'BILLTO',
            title: 'CUSTOMER',
            hidden: true,
            noSearch: false
          },
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: this.appSetting.enableMultiSeriesInSales == 1 ? true : false,
            noSearch: this.appSetting.enableMultiSeriesInSales == 1 ? true : false
          },
          {
            key: 'CHALANNO',
            title: 'VOUCHER NO.',
            hidden: this.appSetting.enableMultiSeriesInSales == 1 ? false : true,
            noSearch: this.appSetting.enableMultiSeriesInSales == 1 ? false : true
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: true
          },
          {
            key: 'TRNMODE',
            title: 'INVOICE TYPE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }
    if (VoucherPrefix == "DM") {
      return {
        title: "Vouchers",
        apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'AMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false
          },
          {
            key: 'TRNSTATUS',
            title: 'STATUS',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'REF BILL',
            hidden: false,
            noSearch: false
          }
        ]
      }
    }
    if (VoucherPrefix == "SALESORDERFROMMOBILE") {
      return {
        title: "Vouchers",
        apiEndpoints: `/VoucherListTranWise/SOINSALESINVOICE`,
        defaultFilterIndex: 0,
        columns: [
          {
            key: 'trndate',
            title: 'Date',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'Order No.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'DSMNAME',
            title: 'Dsm',
            hidden: false,
            noSearch: false
          },
          {
            key: 'BEAT',
            title: 'Beat',
            hidden: false,
            noSearch: false
          },
          {
            key: 'ACNAME',
            title: 'Customer',
            hidden: false,
            noSearch: false
          }
        ]
      }
    }
    if (VoucherPrefix == "QT") {

      return {

        title: "Quotations",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 1,
        columns: [
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'VCHRNO',
            title: 'VOUCHER NO.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'NETAMNT',
            title: 'NETAMOUNT',
            hidden: false,
            noSearch: false
          },
          {
            key: 'DELIVERYDATE',
            title: 'DELIVERYDATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFBILL',
            title: 'RFQ No',
            hidden: false,
            noSearch: false
          },
          {
            key: 'rfqvalidity',
            title: 'rfqvalidity',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REMARKS',
            title: 'REMARKS',
            hidden: false,
            noSearch: false
          }
        ]
      };

    }
    if (VoucherPrefix == "RFQ") {

      return {
        title: "RFQ List",
        apiEndpoints: `/getMasterPagedListOfAny`,
        defaultFilterIndex: 1,
        showActionButton: true,
        actionKeys: [
          {
            icon: 'fa fa-info-circle',
            text: "View Supplier History",
            title: "View Supplier History",
            hidden: false,
          }
        ],
        columns: [
          {
            key: 'TRNDATE',
            title: 'DATE',
            hidden: false,
            noSearch: false
          },
          {
            key: 'RFQNO',
            title: 'RfqNo.',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REFNO',
            title: 'Refno',
            hidden: false,
            noSearch: false
          },
          {
            key: 'rfqvalidity',
            title: 'Valid Upto',
            hidden: false,
            noSearch: false
          },
          {
            key: 'REMARKS',
            title: 'Remarks',
            hidden: false,
            noSearch: false
          },
          {
            key: 'QuotationsApproved',
            title: 'QTAprvd',
            hidden: false,
            noSearch: false
          }
        ]
      };
    }

    return {
      title: "Vouchers",
      apiEndpoints: `/getTrnMainPagedList/${VoucherPrefix}`,
      defaultFilterIndex: 0,
      columns: [
        {
          key: 'BILLTO',
          title: 'CUSTOMER',
          hidden: true,
          noSearch: false
        },
        {
          key: 'TRNDATE',
          title: 'DATE',
          hidden: false,
          noSearch: false
        },
        {
          key: 'VCHRNO',
          title: 'VOUCHER NO.',
          hidden: false,
          noSearch: false
        },
        {
          key: 'NETAMNT',
          title: 'AMOUNT',
          hidden: false,
          noSearch: false
        },
        {
          key: 'REMARKS',
          title: 'REMARKS',
          hidden: false,
          noSearch: false
        },
        {
          key: 'TRNSTATUS',
          title: 'STATUS',
          hidden: false,
          noSearch: true
        },
      ]
    };
  }

  CHECKTRANSPORT() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/CheckTransport', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }





  getAccountWiseTrnAmount(trnDate: string, companyId: string, acid: string, division: string, requestType: number = 0) {
    return new Observable((observer: Subscriber<any>) => {
      let url = `${this.apiUrl}/getAccountWiseTrnAmount/${requestType}?trnDate=${trnDate}&companyId=${companyId}&acid=${acid}&division=${division}`;
      this.http
        .get(url, this.getRequestOption())
        .subscribe(
          res => {
            let data = res.json();
            if (data.status == 'ok') {
              observer.next(data);
              observer.unsubscribe();
            }
            else {
              observer.next(data)
              observer.unsubscribe();
            }
          },
          error => {
            observer.next(<any>{});
          });
    });
  }




  invoiceListByDate(filter) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + '/getInvoiceListByDate', filter, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  focusAnyControl(id: string) {

    let control = document.getElementById(id);
    if (control != null) {
      control.focus();
      control.click();
    }
  }
  RemoveFocusFromAnyControl(id: string) {
    let control = document.getElementById(id);
    if (control != null) {
      control.blur();
    }
  }
  scrollToControlInTable(id: string) {
    var elmnt = document.getElementById(id);
    if (elmnt != null) {
      elmnt.scrollIntoView();
    }
  }
  sendmail(html, voucherno, prac) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    let bodyData = { html: html, voucherno: voucherno, prac: prac };
    this.http
      .post(this.apiUrl + "/SendMail", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          returnSubject.next(error);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  public downloadCustomersCSV(ptype: string = "C") {
    return this.http
      .get(this.apiUrl + `/downloadCustomerCsv?Ptype=${ptype}`, this.getRequestOption())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `${ptype.toLowerCase() == 'c' ? 'Customers_' : 'Supplier_'}${this.userProfile.CompanyInfo.COMPANYID}.csv`
        };
        return data;
      });
  }

  public downloadSuppliersCSV() {
    return this.http
      .get(this.apiUrl + `/downloadSupplierCsv`, this.getRequestOption())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `Suppliers_${this.userProfile.CompanyInfo.COMPANYID}.csv`
        };
        return data;
      });
  }

  public downloadDoctorCSV() {
    return this.http
      .get(this.apiUrl + `/downloadCustomerCsv?Ptype=D`, this.getRequestOption())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `Doctor_${this.userProfile.CompanyInfo.COMPANYID}.csv`
        };
        return data;
      });
  }


  public downloadExcelOrCsvFiles(downloadUrl: string, filename: string = "download", fileType = "xlsx") {
    if (fileType == "xlsx") {
      return this.http
        .get(this.apiUrl + `${downloadUrl}`, this.getRequestOptionForExcelDownload())
        .map((response: Response) => {
          let data = {
            content: new Blob([(<any>response)._body], {
              type: response.headers.get("Content-Type")
            }),
            filename: `${filename}.xlsx`
          };
          return data;
        }, error => { return error });
    }
    else {
      return this.http
        .get(this.apiUrl + `${downloadUrl}`, this.getRequestOption())
        .map((response: Response) => {
          let data = {
            content: new Blob([(<any>response)._body], {
              type: response.headers.get("Content-Type")
            }),
            filename: `${filename}.csv`
          };
          return data;
        });
    }
  }
  public downloadRdlcPdf(body: any, downloadUrl: string, filename: string = "download") {

    return this.http
      .post(this.apiUrl + `${downloadUrl}`, body, this.getRequestOptionForPDFDownload())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `${filename}.pdf`
        };
        return data;
      });

  }
  public getRequestOptionForPDFDownload() {
    let headers: Headers = new Headers({
      "Accept": "application/pdf",
      Authorization: this.authService.getAuth().token

    });
    return new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
  }
  private getRequestOptionForExcelDownload() {
    let headers: Headers = new Headers({
      "Accept": "application/vnd.ms-excel",
      Authorization: this.authService.getAuth().token
    });
    return new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
  }
  downloadFile(response: any) {
    const element = document.createElement('a');
    element.href = URL.createObjectURL(response.content);
    element.download = response.filename;
    document.body.appendChild(element);
    element.click();
  }



  public getPrintDataForCustomisedPrint(printParams: any[]) {
    const type = 'application/pdf';
    const options = new RequestOptions({
      responseType: ResponseContentType.Blob,
      headers: new Headers({
        'Accept': type,
        Authorization: this.authService.getAuth().token
      })
    });
    return this.http
      .post(`${this.apiUrl}/Pdf`, printParams, options).map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          })
        };
        return data;
      });
  }

  public getWeight() {
    const type = 'application/json';
    const options = new RequestOptions({
      responseType: ResponseContentType.Json,
      headers: new Headers({
        'Accept': type,
      })
    });
    return this.http
      .get(`http://localhost:5005/api/getValue`, options).map((response: Response) => {
        var data = response.json();
        return data;
      });
  }







  public updateCustomer() {
    return this.http
      .get(this.apiUrl + `/updateCustomerCSV`, this.getRequestOptionForExcelDownload())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `Customers_${this.userProfile.CompanyInfo.COMPANYID}.xlsx`
        };
        return data;
      });
  }
  public updateState() {
    return this.http
      .get(this.apiUrl + `/downloadStateCSV`, this.getRequestOptionForExcelDownload())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `States_${this.userProfile.CompanyInfo.COMPANYID}.xlsx`
        };
        return data;
      });

  }

  public updateDistrict() {
    return this.http
      .get(this.apiUrl + `/downloadDistrictCSV`, this.getRequestOptionForExcelDownload())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `Districts_${this.userProfile.CompanyInfo.COMPANYID}.xlsx`
        };
        return data;
      });

  }


  getExcelReport(reportData: any) {

    const type = 'application/vnd.ms-excel';
    const options = new RequestOptions({
      responseType: ResponseContentType.Blob,
      headers: new Headers({
        'Accept': type,
        Authorization: this.authService.getAuth().token
      })
    });

    return this.http
      .post(this.apiUrl + `/downLoadAllReportExcel`, reportData, options,)
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `${reportData.reportname}.${reportData.exportFormat}`
        };
        return data;
      });
  }
  getReportDescription(reportname: any) {

  }


  getCSVReport(reportData: any) {
    return this.http
      .post(this.apiUrl + `/downLoadAllReportExcel`, reportData, this.getRequestOption())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `${reportData.reportname}.${reportData.exportFormat}`
        };
        return data;
      });
  }



  ValidateDate(date: string) {
    var dateFieldArray = date.split('/');
    var year = parseInt(dateFieldArray[2]);
    var month = parseInt(dateFieldArray[1]) - 1;
    var day = parseInt(dateFieldArray[0]);
    var d = new Date(year, month, day);
    if (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day) {
      return true;
    }
    return false;
  };
  changeIMsDateToDate(date) {
    var separator = "/";
    if (date.includes("/")) {
      separator = "/";
    } else if (date.includes("-")) {
      separator = "-";
    }
    var dateFieldArray = date.split(separator);
    var year = dateFieldArray[2];
    var month = dateFieldArray[1];
    var day = dateFieldArray[0];
    var d = `${year}-${month}-${day}`
    return d;
  }


  customDateFormate(date: string) {
    var separator = "/";
    if (date.includes("/")) {
      separator = "/";
    } else if (date.includes("-")) {
      separator = "-";
    }
    var dateFieldArray = date.split(separator);
    var year = dateFieldArray[0];
    var month = dateFieldArray[1];
    var day = dateFieldArray[2];
    var d = `${day}/${month}/${year}`;
    return d;
  }

  //CREATION MODE OF VOUCEHRS
  //if it is import from another voucher then _PREFIX is added to the  creation mode
  po_manual: string = "MANUAL_PO";
  po_excelimport: string = "EXCELIMPORT_PO";
  so_manual: string = "MANUAL_SO";
  so_excelimport: string = "EXCELIMPORT_SO";
  so_mobileimport: string = "MOBILE_SO";
  pp_manual: string = "MANUAL_PP";
  ti_manual: string = "MANUAL_TI";

  clearHoldBill(billNo: string) {

  }
  public getMcodeWiseStockList() {
    return this.http
      .get(this.apiUrl + "/getAllMenuitemWithMCodeWiseStock", this.getRequestOption())
      .map(response => response.json() || []);
  }


  public getCurrentUser() {
    let currentuser: any = JSON.parse(localStorage.getItem("USER_PROFILE"));
    return currentuser;
  }



  getInterCompanyTransferPartyList() {
    return this.http.get(this.apiUrl + '/getInterCompanyTransferPartyList', this.getRequestOption())
      .map(response => response.json() || []);

  }


  ////PayTM////
  sendPaytmPaymentRequest(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = requestBody;
    this.http
      .post(
        this.apiUrl + "/createpaytmpaymentrequest",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  resendPaytmPaymentRequest(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = requestBody;
    this.http
      .post(
        this.apiUrl + "/resendpaytmpaymentrequest",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  checkPaytmPaymentStatusRequest(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = requestBody;
    this.http
      .post(
        this.apiUrl + "/checkpaytmpaymentrequeststatus",
        bodyData,
        this.getRequestOption()
      )
      .subscribe(
        response => {
          let data = response.json();
          if (data.status == "ok") {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          } else {
            returnSubject.next(data);
            returnSubject.unsubscribe();
          }
        },
        error => {
          res.status = "error";
          res.result = error;
          returnSubject.next(res);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
    /* return this.http.get("/rategroups.json").toPromise()
             .then((res) => res.json());*/
  }

  saveLocationAddandUpdate(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/createlocationaddupdate', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }


  public getDivWiseWarehouseList(refresh: boolean = false) {

    return this.http.get(this.apiUrl + '/getDivWiseWarehouseList', this.getRequestOption())
      .map(response => response.json() || [])
  }
  public getCustomerCategoryByName(name) {
    return this.http.get(this.apiUrl + `/getCustomerCategoryByName?name=${name}`, this.getRequestOption())
      .map(data => data.json())
      .share()
  }

  public getCategoryTypeForPriceDrop(): Observable<any> {
    return this.http.get(this.apiUrl + '/getCategoryType', this.getRequestOption())
      .map(response => response.json() || []);
  }
  getMasterSchemeList() {
    return this.http
      .get(this.apiUrl + '/getMasterSchemeList', this.getRequestOption()).map(response => response.json() || []);
  }
  getSchemeByID(Initial: string, type: string) {
    let bodyData = { mode: 'query', data: { schemeID: Initial, schemeType: type } };
    return this.http.post(this.apiUrl + '/getSchemeByID', bodyData, this.getRequestOption()).map((res) => res.json());
  }
  //delete scheme
  deleteScheme(schemeID: string, schemeType: string) {
    let res = { status: "error", result: '' };
    let returnSubject: Subject<any> = new Subject();
    let bodyData = { mode: 'query', data: { DisID: schemeID, SchemeType: schemeType } };
    this.http.post(this.apiUrl + '/deleteScheme', bodyData)
      .subscribe((data: any) => {
        if (data.status === 'ok') {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
        else {
          returnSubject.next(data);
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      });
    return returnSubject;
  }
  createGatePass(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/createGatePass', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }


  saveDeliveryBoyMaster(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/saveDeliveryBoyMaster', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  public getGatePass() {
    return this.http.get(this.apiUrl + '/getGatePassPagedList?currentpage=1&maxResultCount=100', this.getRequestOption())
      .map(response => response.json() || []);
  }
  getTopTransactionForPurchase(mcode: string, suppliername: string) {
    return this.http
      .get(this.apiUrl + `/top10TransactionForPurchaseItemWise?mcode=${mcode}&suppliername=${suppliername}`, this.getRequestOption()).map(response => response.json() || []);
  }
  getTopTransactionForSales(mcode: string, customername: string) {
    return this.http
      .get(this.apiUrl + `/top10TransactionForSalesItemWise?mcode=${mcode}&customername=${customername}`, this.getRequestOption()).map(response => response.json() || []);
  }
  getTopTransactionForDebitNote(mcode: string, suppliername: string) {
    return this.http
      .get(this.apiUrl + `/topTransactionForDebitItemWise?mcode=${mcode}&suppliername=${suppliername}`, this.getRequestOption()).map(response => response.json() || []);
  }
  getTopTransactionForCreditNote(mcode: string, customername: string) {
    return this.http
      .get(this.apiUrl + `/top10TransactionForCreditNoteItemWise?mcode=${mcode}&customername=${customername}`, this.getRequestOption()).map(response => response.json() || []);
  }
  getBillListCustomerwise(acid: string, fromDate: any, toDate: any) {
    return this.http.get(this.apiUrl + `/billListCustomerwise?acid=${acid}&from=${fromDate}&to=${toDate}`, this.getRequestOption()).map(response => response.json() || []);
  }
  getBillList(vchrno: string, acid?: string) {
    if (vchrno) {
      return this.http.get(this.apiUrl + `/billwiseItemDetails?billno=${vchrno}`, this.getRequestOption()).map(response => response.json() || []);
    }
    else {
      return this.http.get(this.apiUrl + `/billwiseItemDetails?acid=${acid}`, this.getRequestOption()).map(response => response.json() || []);
    }
  }
  sendReportToMail(body) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    let opt = this.getRequestOption();
    let hd: Headers = new Headers({ "Content-Type": "application/json" });
    let op: RequestOptions = new RequestOptions();
    // let bodyData = { html: html, voucherno: voucherno, prac: prac };
    let bodyData = {
      body: body
    };
    this.http
      .post(this.apiUrl + "/SendToMail", bodyData, this.getRequestOption())
      .subscribe(
        data => {
          let retData = data.json();
          if (retData.status == "ok") {
            res.status = "ok";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          } else {
            res.status = "error1";
            res.result = retData.result;
            returnSubject.next(res);
            returnSubject.unsubscribe();
          }
        },
        error => {
          returnSubject.next(error);
          returnSubject.unsubscribe();
        }
      );
    return returnSubject;
  }
  saveRemarks(remarks, remarksType) {
    let body = {
      remarks: remarks,
      remarksType: remarksType
    }
    return this.http.post(this.apiUrl + '/saveRemarks', body, this.getRequestOption());
  }

  DeleteRemarks(remarks, remarksType) {
    let body = {
      remarks: remarks,
      remarksType: remarksType
    }
    return this.http.post(this.apiUrl + '/DeleteRemarks', body, this.getRequestOption());
  }




  gethtmlDesignedPrint(data) {
    return this.http
      .post(`${this.apiUrl}/getPDFInvoice`, data, this.getRequestOptionForPDFDownload())
      .map((response: Response) => {
        let data = {
          content: new Blob([(<any>response)._body], {
            type: response.headers.get("Content-Type")
          }),
          filename: `TaxInvoice.pdf`
        };
        return data;
      });
  }
  selectSmsCategory(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/selectSmsCategory', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  sendQuickEmail(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/insertEmail', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  sendQuickMessage(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/insertMessage', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  selectOutletByTemplateType(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/selectOutletByTemplateType', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }
  selectOutlet() {

    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.get(this.apiUrl + '/selectOutlet', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }
  selectTemplate() {
    console.log("step2");
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.get(this.apiUrl + '/selectTemplate', this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  selectSmsCatByOutLetidandTemplateType(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/selectSmsCatByOutLetidandTemplateType', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }
  insertMyscheduler(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/insertMyscheduler', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  selectTemplateKeyByCatID(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/selectTemplateKeyByCatID', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }
  myCustomizeMessage(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/myCustomizeMessage', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }
  outletmaster(requestBody: any) {
    console.log("in")
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/insertOutletMaster', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      console.log(data, "DATA");
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;

  }
  categorymaster(requestBody: any) {
    console.log(requestBody);
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/insertCategoryMaster', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      console.log(data, "DATA");
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;

  }
  myCustomizeEmail(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/myCustomizeEmail', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  addCaretDetails(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/addCaretDetails', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }

  getCrateBalancebyCustomer(CustomerName, ACIDTYPE) {
    return this.http.get(this.apiUrl + `/getCrateBalancebyCustomer?CustomerName=${CustomerName}&ACIDTYPE=${ACIDTYPE}`, this.getRequestOption()).map(response => response.json() || []);
  }

  getListOfAny(api: string) {
    return this.http
      .get(this.apiUrl + api, this.getRequestOption()).map(response => response.json() || []);
  }
  getListOfAnyFromPostmethod(api: string, postData: any) {
    return this.http
      .post(this.apiUrl + api, postData, this.getRequestOption())
      .map(response => response.json() || []);
  }

  public getPageWiseControlListDetail(pageName, pageNo, pageSize) {
    return this.http.get(this.apiUrl + '/getPageWiseControlListDetail?pageName=' + pageName + '&pageNo=' + pageNo + '&pageSize=' + pageSize + '', this.getRequestOption())
      .map(response => response.json() || []);
  }

  getPageWiseControlDetail(gateId) {
    return this.http.get(this.apiUrl + '/getPageWiseSettingDetail?gateId=' + gateId + '', this.getRequestOption())
      .map(response => response.json() || []);
  }



  saveRecordPageWiseControl(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/savePageWiseControlSetting', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();

      if (data.status == 'ok') {

        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );

    return returnSubject;
  }

  getChildDomainList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getChilddomainList', this.authService.getRequestOption())
      .map(res => res.json())
      .subscribe(data => {
        if (data.status == 'ok') {
          let r = data.result;
          returnSubject.next(r);
          returnSubject.unsubscribe();
        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
      );
    return returnSubject;
  }

  getPageNameList() {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getPageNameList', this.authService.getRequestOption())
      .map(res => res.json())
      .subscribe(data => {
        if (data.status == 'ok') {
          let r = data.result;
          returnSubject.next(r);
          returnSubject.unsubscribe();
        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
      );
    return returnSubject;
  }

  saveRecordCommonPageWiseControl(requestBody: any) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject()
    this.http.post(this.apiUrl + '/saveCommonSettingPage', requestBody, this.getRequestOption()).subscribe(response => {
      let data = response.json();

      if (data.status == 'ok') {

        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      //res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );

    return returnSubject;
  }

  getPageWiseAccess(routingUrl, controlName, controltype) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.get(this.apiUrl + '/getCommonPageWise?routingUrl=' + routingUrl + '&controlName=' + controlName + '&controltype=' + controltype + '', this.authService.getRequestOption())
      .map(res => res.json())
      .subscribe(data => {
        if (data.status == 'ok') {
          let r = data.result;
          returnSubject.next(r);
          returnSubject.unsubscribe();
        }
        else {
          returnSubject.next(data)
          returnSubject.unsubscribe();
        }
      }, error => {
        res.status = 'error'; res.result = error;
        returnSubject.next(res);
        returnSubject.unsubscribe();
      }
      );
    return returnSubject;
  }

  public getAllCustomerCategory() {
    return this.http.get(this.apiUrl + `/getAllCustomerCategory`, this.authService.getRequestOption())
      .map(data => data.json())
      .share()
  }

  public focusAnyControlById = (idlist: string[]) => {
    for (var id in idlist) {
      if (this.document.getElementById(idlist[id]) != null) {
        setTimeout(() => this.document.getElementById(idlist[id]).focus());
        return;
      }
    }

  }




  getMasterFormData(formName: string) {
    return this.http
      .get(this.apiUrl + `/getFormSetting?formname=${formName}`, this.getRequestOption())
      .map(data => data.json())

  }


  downlaodImage(urlImage) {
    return this.http.get(this.apiUrl + "/prescriptions?filename=" + urlImage, this.getRequestOptionForImageDownload()).map((response: Response) => {
      let data = {
        content: new Blob([(<any>response)._body], {
          type: response.headers.get("Content-Type")
        }),
        filename: `${urlImage}.png`
      };
      return data;
    });
  }




  public getRequestOptionForImageDownload() {
    let headers: Headers = new Headers({
      "Content-Type": "application/png",
      Authorization: this.authService.getAuth().token

    });
    return new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
  }


  public isValidString(args: string): boolean {
    if (args == "" || args == undefined || args == null) {
      return false;
    }
    return true;
  }

  loadItemImageList(filter) {
    let res = { status: "error", result: "" };
    let returnSubject: Subject<any> = new Subject();
    this.http.post(this.apiUrl + '/loadItemImageList', filter, this.getRequestOption()).subscribe(response => {
      let data = response.json();
      if (data.status == 'ok') {
        returnSubject.next(data);
        returnSubject.unsubscribe();

      }
      else {
        returnSubject.next(data)
        returnSubject.unsubscribe();
      }
    }, error => {
      res.status = 'error'; res.result = error;
      returnSubject.next(res);
      returnSubject.unsubscribe();
    }
    );
    return returnSubject;
  }


}




export class HotkeyConfig {
  [key: string]: string[];
}
export class ConfigModel {
  hotkeys: HotkeyConfig;
}
export class Command {
  name: string;
  combo: string;
  ev: KeyboardEvent;
}

