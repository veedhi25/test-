import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { AuthService } from '../../../../common/services/permission';
import { Subject } from 'rxjs/subject';
import { GlobalState } from "../../../../global.state";
// import { SalesTerminal, Division, TerminalCategory, SalesAC, VatAC, CashAC, SalesReturnAC, DiscountAC, Product} from './sales-terminal.interface';

@Injectable()
export class SalesTerminalService {
    constructor(private http: Http, private authService: AuthService,private state:GlobalState) {
    }
 private get apiUrl():string{
        let url=this.state.getGlobalSetting("apiUrl");
        let apiUrl ="";
        
        if(!!url && url.length>0){apiUrl=url[0]};
        return apiUrl
    }
      getSalesTerminal(Initial:string) {
        let res={status:"error",result:""};
        let returnSubject:Subject<any>=new Subject();
        console.log("about to edit");
        let bodyData = {mode:'query',data:{INITIAL:Initial}};
        this.http.post(this.apiUrl +'/getSalesTerminal',bodyData,this.getRequestOption())
            .subscribe(response=>{
                let data = response.json();
                if(data.status == 'ok'){
                    returnSubject.next(data);
                    returnSubject.unsubscribe();

                }
                else{
                    returnSubject.next(data)
                    returnSubject.unsubscribe();
                }
            },error =>{
                res.status='error';res.result=error;
                returnSubject.next(res);
                returnSubject.unsubscribe();
            }
            );
            return returnSubject;
       /* return this.http.get("/rategroups.json").toPromise()
            .then((res) => res.json());*/
            

    }

    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }

    

    // salesTerminalList = [
    //     {
    //     id: 1,
    //     terminalId: 'T1001',
    //     terminalName: "Terminal 1"
    //     },
    //     {
    //     id: 2,
    //     terminalId: 'T1002',
    //     terminalName: "Terminal 2"
    //     },
    //     {
    //     id: 3,
    //     terminalId: 'T1003',
    //     terminalName: "Terminal 3"
    //     },
    //     {
    //     id: 4,
    //     terminalId: 'T1004',
    //     terminalName: "Terminal 4"
    //     },
    //     {
    //     id: 5,
    //     terminalId: 'T1005',
    //     terminalName: "Terminal 5"
    //     },
    // ]
    // getData(): Promise<any> {
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve(this.salesTerminalList);
    //     }, 500);
    //     });
    // }
    
    // getWareHouse(){
    //     return [
    //         {
    //             name: "Ware-House 1"
    //         },
    //         {
    //             name: "Ware-House 2"
    //         },
    //         {
    //             name: "Ware-House 3"
    //         },
    //         {
    //             name: "Ware-House 4"
    //         },
    //         {
    //             name: "Ware-House 5"
    //         }
    //     ];
    // };

    // getTerminalCategory(){
    //     return [
    //         {
    //             name: "Category 1"
    //         },
    //         {
    //             name: "Category 2"
    //         },
    //         {
    //             name: "Category 3"
    //         },
    //         {
    //             name: "Category 4"
    //         },
    //         {
    //             name: "Category 5"
    //         }
    //     ];
    // };

    // getSalesAC(){
    //     return [
    //         {
    //             name: "Sales A/C 1"
    //         },
    //         {
    //             name: "Sales A/C 2"
    //         },
    //         {
    //             name: "Sales A/C 3"
    //         },
    //         {
    //             name: "Sales A/C 4"
    //         },
    //         {
    //             name: "Sales A/C 5"
    //         }
    //     ];
    // };

    // getVatAC(){
    //     return [
    //         {
    //             name: "VAT A/C 1"
    //         },
    //         {
    //             name: "VAT A/C 2"
    //         },
    //         {
    //             name: "VAT A/C 3"
    //         },
    //         {
    //             name: "VAT A/C 4"
    //         },
    //         {
    //             name: "VAT A/C 5"
    //         }
    //     ];
    // };

    // getCashAC(){
    //     return [
    //         {
    //             name: "Cash A/C 1"
    //         },
    //         {
    //             name: "Cash A/C 2"
    //         },
    //         {
    //             name: "Cash A/C 3"
    //         },
    //         {
    //             name: "Cash A/C 4"
    //         },
    //         {
    //             name: "Cash A/C 5"
    //         }
    //     ];
    // };

    // getSalesReturnAC(){
    //     return [
    //         {
    //             name: "Sales Return A/C 1"
    //         },
    //         {
    //             name: "Sales Return A/C 2"
    //         },
    //         {
    //             name: "Sales Return A/C 3"
    //         },
    //         {
    //             name: "Sales Return A/C 4"
    //         },
    //         {
    //             name: "Sales Return A/C 5"
    //         }
    //     ];
    // };

    // getDiscountAC(){
    //     return [
    //         {
    //             name: "Discount A/C 1"
    //         },
    //         {
    //             name: "Discount A/C 2"
    //         },
    //         {
    //             name: "Discount A/C 3"
    //         },
    //         {
    //             name: "Discount A/C 4"
    //         },
    //         {
    //             name: "Discount A/C 5"
    //         }
    //     ];
    // };

    // getProduct(){
    //     return [
    //         {
    //             name: "Product 1"
    //         },
    //         {
    //             name: "Product 2"
    //         },
    //         {
    //             name: "Product 3"
    //         },
    //         {
    //             name: "Product 4"
    //         },
    //         {
    //             name: "Product 5"
    //         }
    //     ];
    // };

}