import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { GlobalState } from "../../../../../global.state";
import { AuthService } from "../../../../../common/services/permission";
import { Subject } from "rxjs";
import { NodeSelectedEvent } from "ng2-tree";
import { Loyalty } from "../../../../../common/interfaces/loyalty.interface";
import { TransactionService } from "../../Transaction Components/transaction.service";

@Injectable()
export class LoyaltyService {
    loyaltyList: any[] = [];
    masterService: any;
    loyalty: any;

    constructor(private http: Http, private authService: AuthService, private state: GlobalState) {
        



    }








}