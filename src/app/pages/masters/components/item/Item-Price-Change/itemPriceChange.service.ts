import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../common/services/permission';
import { GlobalState } from '../../../../../../app/global.state';
@Injectable()

export class ItemPriceChangeService {

    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }

    public getAllMenuItemPaged(currentPage,maxResultCount){
        return this.http.get(this.apiUrl+`/getAllMenuItemPaged?currentPage=${currentPage}&maxResultCount=${maxResultCount}`,this.getRequestOption())
        .map(data=>data.json())
        .share()
    }

    public getItemDetailForPriceChange(menuCode,mCode) {
        return this.http.get(this.apiUrl + `/getItemDetailForPriceChang?menuCode=${menuCode}&mCode=${mCode}`, this.getRequestOption())
            .map(data => data.json())
            .share();
    }



    public addItemPrice(data){
        return this.http.post(this.apiUrl+'/addItemPrice',data,this.getRequestOption())
        .map(data=>data.json())
        .share();
    }



    public getPriceDropDetails(tag) {
        return this.http.get(this.apiUrl + `/getPriceDropDetails?tag=${tag}`, this.getRequestOption())
            .map(data => data.json())
            .share();
    }




    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }

}