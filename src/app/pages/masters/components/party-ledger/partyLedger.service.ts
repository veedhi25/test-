import { MasterRepo } from './../../../../common/repositories/masterRepo.service';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject'
import { GlobalState } from "../../../../global.state";
import { ItemRate, Product, TBarcode } from '../../../../common/interfaces/ProductItem';
import { AlternateUnit } from '../../../../common/interfaces/TrnMain';

@Injectable()

export class TreeViewPartyervice {
    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState, private masterService: MasterRepo) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }
    getParentWisePartyList(ACID: string) {
        return this.http.get(this.apiUrl + '/getParentWiseAccount/' + ACID, this.getRequestOption()).flatMap(response => response.json() || []);
    }

    getNewValues(mcode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getNewValues/' + mcode, this.getRequestOption()).subscribe(response => {
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

    getPartyList(mcode: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getPartyList/' + mcode, this.getRequestOption()).subscribe(response => {
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
    getAllParty(ACID: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        this.http.get(this.apiUrl + '/getAllData/' + ACID, this.getRequestOption()).subscribe(response => {
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
    savePartyList(mode: string, prodObj: Product, RGLIST: ItemRate[], AlternateUnits: AlternateUnit[], PBarCodeCollection: TBarcode[]) {
        let res = { status: "error", result: "" }
        let returnSubject: Subject<any> = new Subject();
        let opt = this.getRequestOption();
        let hd: Headers = new Headers({ 'Content-Type': 'application/json' });
        let op: RequestOptions = new RequestOptions()
        let bodyData = { mode: mode, data: { product: prodObj, rglist: RGLIST, alternateunits: AlternateUnits, pbarcodes: PBarCodeCollection } };
        console.log("product json");
        var data = JSON.stringify(bodyData, undefined, 2);
        console.log(data);
        this.http.post(this.apiUrl + "/savePartyList", bodyData, this.getRequestOption())
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
    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }

    public getParentGroups(acid: string) {
        
        return new Observable((observer: Subscriber<GroupParty[]>) => {
            this.http.get(this.masterService.apiUrl + '/getParents?acid=' + acid, this.masterService.getRequestOption())
                .map(data => {
                    
                    return data.json()
                })
                .subscribe(res => {
                    if (res.status == 'ok') {
                        observer.next(res.result);
                    }
                }, error => {
                    this.masterService.resolveError(error, 'getParents');
                    observer.complete();
                },
                () => {
                    observer.complete();
                }
                )
        })


    }

    public getChildrenGroups(acid: string) {
        console.log({ getChildrenAcid: acid, url: this.masterService.apiUrl + '/getChildren?' + acid });
        return new Observable((observer: Subscriber<GroupParty[]>) => {
            this.http.get(this.masterService.apiUrl + '/getChildren?acid=' + acid, this.masterService.getRequestOption())
                .map(data => data.json())
                .subscribe(res => {
                    console.log({ getChildrenResult: res });
                    observer.next(res.result);
                }, error => {
                    this.masterService.resolveError(error, 'getChildren');
                    observer.complete();
                },
                () => {
                    observer.complete();
                }
                )
        })
    }

    public getTopGroups() {
        return new Observable((observer: Subscriber<GroupParty[]>) => {
            this.http.get(this.masterService.apiUrl + '/getTopPartyGroups', this.masterService.getRequestOption())
                .map(data => data.json())
                .subscribe(res => {
                    observer.next(<GroupParty[]>res.result);
                }, error => {
                    this.masterService.resolveError(error, 'getTopGroups');
                    observer.complete();
                },
                () => {
                    observer.complete();
                }
                )
        })
    }
}

export interface GroupParty {
    ACID: string;
    ACNAME: string;
    PARENT: string;
    TYPE: string;
    PType: string;
    MAPID: string;
    CHILDLIST: any[];
    SELECTEDGROUP: any;
    LIST: Observable<any[]>;
    SELECTEDGROUPAC: GroupParty;
}
