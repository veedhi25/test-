import { SessionStorage } from "./sessionStorage.service";
import { Injectable } from '@angular/core'
export class CACHE_CONSTANT {
    USER_PROFILE:string
    TOKEN: string
};

@Injectable()
export class CacheService {
     constructor(){
         
     }

    remove(key: string) {
        // window.sessionStorage.removeItem(key);
        if (this.exist) localStorage.removeItem(key)
        //SessionStorage.remove(key);
    }
    exist(key: string): boolean {
        return localStorage.getItem(key)  != null
        // return window.sessionStorage.getItem(key) != null;
        //return sessionStorage.exist(key);
    }
    get(key: string): any {
        if (!this.exist(key)) {
            return null;
        }
        // let data: any = window.sessionStorage.getItem(key);
        let data: any = localStorage.getItem(key);
        return JSON.parse(data);
        //return sessionStorage.get(key);
    }
    set(key: string, data: any): any {
        // window.sessionStorage.setItem(key, JSON.stringify(data));
        localStorage.setItem(key, JSON.stringify(data));
        //return sessionStorage.set(key, data);
    }

    // checkUserRight(right:string){
    //     // let user_profile:any=window.sessionStorage.getItem('USER_PROFILE')
    //     let user_profile:any= localStorage.getItem('USER_PROFILE')
    //     let user_rights:any;
    //     var result;
    //     if(user_profile){
    //         user_rights = user_profile.userRights;
    //         if(user_rights){
    //             result =user_rights[right]
    //         }
    //     }
    //     return result;
    // }
    checkUserRight(right: string): any {
        let user_profile: any =localStorage.getItem('USER_PROFILE');
        let user_rights: any;
        var result: any = <any>{};
        if (user_profile && user_profile.userRights.length) {
            user_rights = user_profile.userRights.filter(x => x.right == right);
            if (user_rights.length) {
                result = user_rights[0]
            }
        }
        return result;
    }
}