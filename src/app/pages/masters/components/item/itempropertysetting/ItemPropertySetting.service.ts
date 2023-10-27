import { Http, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../../common/services/permission';
import { GlobalState } from '../../../../../../app/global.state';
@Injectable()

export class ItemPropertySettingService {

    constructor(private http: Http, private activatedRoute: ActivatedRoute, private authService: AuthService, private state: GlobalState) {
    }
    private get apiUrl(): string {
        let url = this.state.getGlobalSetting("apiUrl");
        let apiUrl = "";

        if (!!url && url.length > 0) { apiUrl = url[0] };
        return apiUrl
    }




    public getMenuItemsPagedList(currentPage, maxResultCount, filter) {
        return this.http.get(this.apiUrl + `/getItemProperty?currentPage=${currentPage}&maxResultCount=${maxResultCount}&filter=${filter}`, this.getRequestOption())
            .map(data => data.json())
            .share();
    }



    public downloadSampleFile(prefix: string, filename: string) {
        return this.http
            .get(this.apiUrl + `/downloadSampleFile/${prefix}`, this.getRequestOption())
            .map((response) => {
                let data = {
                    content: new Blob([(<any>response)._body], {
                        type: response.headers.get("Content-Type")
                    }),
                    filename: `${filename}.csv`
                };
                return data;
            });

    }









    private getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authService.getAuth().token })
        return new RequestOptions({ headers: headers });
    }

}