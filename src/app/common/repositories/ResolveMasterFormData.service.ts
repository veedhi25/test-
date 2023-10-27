import { Injectable } from "@angular/core";  
import { Resolve, ActivatedRouteSnapshot } from "@angular/router";  
import { Observable } from "rxjs";
import { MasterRepo } from "./masterRepo.service";
  
@Injectable()  
export class ResolveMasterFormData implements Resolve<any[]> {  
  constructor(private masterRepo: MasterRepo) {}  
  
  resolve(route: ActivatedRouteSnapshot): Observable<any[]> {  
     let formName = route.data['formName']; 

     return this.masterRepo.getMasterFormData(formName);
    
  }  
}  