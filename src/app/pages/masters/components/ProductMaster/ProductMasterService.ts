import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject'
import { GlobalState } from "../../../../global.state";
import { Brand, Model } from '../../../../common/interfaces/ProductItem';


@Injectable()

export class ProductMasterService {
public searchItemList:any[]=[];

    constructor(private http: Http, private authService: AuthService, private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }
    getParentWiseProduct(MCODE: string) {
        return this.http.get(this.apiUrl + '/getParentWiseProduct/' + MCODE, this.getRequestOption()).flatMap(response => response.json() || []);
    }
     getSearchProducts(searchkey) {
        return this.http.get(this.apiUrl + '/getSearchProducts/' + searchkey, this.getRequestOption()).flatMap(response => response.json() || []);
    }
    getAutoGenerateMenuCode(Fcode, ecode) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getNewMenucode/' + Fcode + '/' + ecode, this.getRequestOption()).subscribe(
            response => {
                let data = response.json();
                if (data.status == 'ok') {
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
            }
            , error => {
                res.status = 'error'; res.result = error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            });

        return returnSubject;
    }

    getProduct(mcode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getProduct/' + mcode, this.getRequestOption()).subscribe(response => {
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

    saveCategory(mcat: string, type: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.post(this.apiUrl + '/saveMCategory/', { MCAT: mcat, TYPE: type }, this.getRequestOption()).subscribe(response => {
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
    getProductForEdit(mcode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getProductByMcode/' + mcode, this.getRequestOption()).subscribe(response => {
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
    getInitialValuesForNewProduct(mcode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getInitialValuesForNewProduct/' + mcode, this.getRequestOption()).subscribe(response => {
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
    getItemGroupByCategoryName(CategoryName: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/ItemGroup/GetItemGroupMasterListByCategoryName/' + CategoryName, this.getRequestOption()).subscribe(response => {
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
    // saveProduct(mode: string, prodObj: Product, RGLIST: ItemRate[], AlternateUnits: AlternateUnit[], PBarCodeCollection: TBarcode[], BrandModelList: any[]) {
    //     let res = { status: "error", result: "" }
    //     let returnSubject: Subject<any> = new Subject();
    //     let opt = this.getRequestOption();
    //     let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
    //     let op: RequestOptions = new RequestOptions()
    //     let bodyData = { mode: mode, data: { product: prodObj, rglist: RGLIST, alternateunits: AlternateUnits, bcodeList: PBarCodeCollection, bmList: BrandModelList } };
    //     console.log("product json");
    //     var data = JSON.stringify(bodyData, undefined, 2);
    //     console.log(data);
    //     this.http.post(this.apiUrl + "/saveProductMaster", bodyData, this.getRequestOption())
    //         .subscribe(data => {
    //             let retData = data.json();
    //             console.log(retData);
    //             if (retData.status == "ok") {
    //                 res.status = "ok";
    //                 res.result = retData.result
    //                 returnSubject.next(res);
    //                 returnSubject.unsubscribe();
    //             }
    //             else {
    //                 res.status = "error1"; res.result = retData.result;
    //                 console.log(res);
    //                 returnSubject.next(res);
    //                 returnSubject.unsubscribe();
    //             }
    //         },
    //         error => {
    //             res.status = "error2", res.result = error;
    //             console.log(res);
    //             returnSubject.next(res);
    //             returnSubject.unsubscribe();
    //         }
    //         );
    //     return returnSubject;

    // }


    saveBrand(brand: Brand) {
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();
        let bodyData = brand;
        // var  data = JSON.stringify(bodyData, undefined, 2);
        this.http.post(this.apiUrl + "/saveBrand", bodyData, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                console.log(retData);
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error1"; res.result = retData.result;
                    console.log(res);
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
            error => {
                res.status = "error2", res.result = error;
                console.log(res);
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;

    }
    saveModel(model: Model) {
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();
        let bodyData = model;
        // var  data = JSON.stringify(bodyData, undefined, 2);
        this.http.post(this.apiUrl + "/saveModel", bodyData, this.getRequestOption())
            .subscribe(data => {
                let retData = data.json();
                console.log(retData);
                if (retData.status == "ok") {
                    res.status = "ok";
                    res.result = retData.result
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
                else {
                    res.status = "error1"; res.result = retData.result;
                    console.log(res);
                    returnSubject.next(res);
                    returnSubject.unsubscribe();
                }
            },
            error => {
                res.status = "error2", res.result = error;
                console.log(res);
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
        return returnSubject;

    }
   
    getListFromKey(url,key){
         let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + url + key, this.getRequestOption()).subscribe(response => {
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
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }
    getUploadFile(modal:any){
        let res={ status:"error", result:"error" }
        let returnSubject:Subject<any> =new Subject();
        let bodyData=modal;

        let headers: Headers = new Headers({ 'Authorization': this.authService.getAuth().token })
        console.log({ headers: headers });
        let ro = new RequestOptions({ headers: headers });
        alert("reached")
        this.http.post(this.apiUrl+ "/SaveImportMenuitemFile" , bodyData, ro).subscribe(response => {
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
    GethCategoryMasterList() {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/hcategory/GethCategoryMasterList/', this.getRequestOption()).subscribe(response => {
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
    // GethCategoryMasterList(): Observable<any> {

    //     let res = { status: "error", result: "" };
    //     let returnSubject: Subject<any> = new Subject();
    //     this.http.get(this.apiUrl + '/hcategory/GethCategoryMasterList', this.getRequestOption()).subscribe(
    //         response => {
    //             let data = response.json();
    //             if (data.status == 'ok') {
    //                 returnSubject.next(data);
    //                 returnSubject.unsubscribe();

    //             }
    //         }
    //         , error => {
    //             res.status = 'error'; res.result = error;
    //             returnSubject.next(res);
    //             returnSubject.unsubscribe();
    //         });

    //     return returnSubject;
    // }
   
}