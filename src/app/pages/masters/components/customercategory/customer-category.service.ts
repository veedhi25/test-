import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { MasterRepo } from '../../../../common/repositories'
import { CustomerCategory } from '../../../../common/interfaces/customercategory.interface'
@Injectable()
export class CustomerCategoryService {

    constructor(private http: Http, private masterService: MasterRepo) {

    }

    public getMultiBusinessDivision() {
        return this.http.get(this.masterService.apiUrl + `/getMultiDivision`, this.masterService.getRequestOption())
            .map(data => data.json())
            .share()
    }
    public saveCustomerCategory(data:CustomerCategory) {
        return this.http.post(this.masterService.apiUrl + `/saveCustomerCategory`,data, this.masterService.getRequestOption())
            .map(data => data.json())
            .share()
    }
    public getAllCustomerCategory() {
        return this.http.get(this.masterService.apiUrl + `/getAllCustomerCategory`, this.masterService.getRequestOption())
            .map(data => data.json())
            .share()
    }
    public getCustomerCategoryByName(name) {
        return this.http.get(this.masterService.apiUrl + `/getCustomerCategoryByName?name=${name}`, this.masterService.getRequestOption())
            .map(data => data.json())
            .share()
    }
}