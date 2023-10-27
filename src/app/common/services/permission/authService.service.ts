import { Injectable, OnInit, OnDestroy } from '@angular/core'
import { CACHE_CONSTANT, CacheService } from "./cacheService.service";
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/subscription';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class AuthService implements OnInit, OnDestroy {
    cache_constant: CACHE_CONSTANT = <CACHE_CONSTANT>{};
    private _subscriptions: Array<Subscription> = [];
    constructor(private cacheService: CacheService, private _cookieService: CookieService) {

    }
    ngOnInit() {

    }

    isAuthorized(routeInstruction: any) {
        let profile = this.getUserProfile();
        return this.isAuthenticated(profile);
    }
    removeAuth(): void {
        this.cacheService.remove('USER_PROFILE');
        this.cacheService.remove('TOKEN');

    }
    isAuthenticated(profile: any) {
        return !!profile;
    }
    setAuth(auth: any) {
        this.cacheService.set('USER_PROFILE', auth.profile);
        this.cacheService.set('TOKEN', auth.token);
        this.cacheService.set('setting', auth.setting);
        this.cacheService.set('funKeySetting', auth.funKeySetting);
        // this.cacheService.set('deviceSetting',auth.deviceSetting);
    }

    setSessionVariable(key: string, value: any) {
        if (this.cacheService.exist(key))
            this.cacheService.remove(key);
        this.cacheService.set(key, value);

    }

    getSessionVariable(key: string) {
        if (!this.cacheService.exist(key)) {
            return null;
        }
        let sessionVariable = this.cacheService.get(key);
        return sessionVariable;
    }
    removeSessionVariable(key: string) {
        this.cacheService.remove(key);
    }

    getAuth(): any {
        let auth: any = {
            profile: this.cacheService.get('USER_PROFILE'),
            token: this.cacheService.get('TOKEN'),

        };
        // console.log({ gettoken: auth.token });
        return auth;
    }

    getCurrentCompanyId(): any {
        let compnyId = 0;
        var profile = this.cacheService.get('USER_PROFILE');
        if (profile) {
            compnyId = profile.CompanyInfo.COMPANYID ? profile.CompanyInfo.COMPANYID : 0;
        }
        return compnyId;
    }


    getUserProfile(): any {
        if (!this.cacheService.exist('USER_PROFILE')) {
            return null;
        }
        let userProfile = this.cacheService.get('USER_PROFILE');
        return userProfile;
    }
    setUserProfile(profile: any) {
        if (!this.cacheService.exist('USER_PROFILE')) {
            return null;
        }
        let userProfile = this.cacheService.set('USER_PROFILE', profile);
    }
    // checkUserRight(right: string) {
    //     let user_profile: any = this.getUserProfile();
    //     let user_rights: any;
    //     var result: any[];
    //     if (user_profile) {
    //         user_rights = user_profile.userRights;
    //         if (user_rights) {
    //             result = user_rights[right]
    //         }
    //     }
    //     return result;
    // }
    checkUserRight(right: string): any {
        let user_profile: any = this.getUserProfile();
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

    ///function for canactivate menu
    public getMenuRight(menu: string, right: string): any {
        var result = { list: false, right: false };
        if (menu == "") return result;
        let user_profile: any = this.getUserProfile();
        let menu_rights: any[] = [];
        var list: boolean = false;
        var mRight: boolean = false;
        if (user_profile) {
            menu_rights = user_profile.menuRights;
            if (menu_rights) {
                for (var m in menu_rights) {
                    if (menu_rights[m].menu == menu) {
                        if (menu_rights[m].right.length > 0) { list = true; }
                        for (var r in menu_rights[m].right) {
                            if (menu_rights[m].right[r] == right) {
                                this.canActive = true;
                                mRight = true
                            }
                        }
                    }
                }
            }
        }
        result = { list: list, right: mRight };
        return result;
    }

    public canActive: boolean = false;
    checkMenuRight(menu: string, right: string) {
        let user_profile: any = this.getUserProfile();
        let menu_rights: any[] = [];
        var result = false;
        if (user_profile) {
            menu_rights = user_profile.menuRights;
            if (menu_rights) {
                for (var m in menu_rights) {
                    if (menu_rights[m].menu == menu) {
                        for (var r in menu_rights[m].right) {
                            if (menu_rights[m].right[r] == right) {
                                this.canActive = result;
                                result = true;
                            }
                        }
                    }
                }
            }
        }
        return result;
    }

    getSetting() {
        if (!this.cacheService.exist('setting')) {
            return undefined;
        }
        let setting = this.cacheService.get('setting');
        return setting;
    }
    getFunctionKeySetting() {
        if (!this.cacheService.exist('funKeySetting')) {
            return [];
        }
        let funKeySetting = this.cacheService.get('funKeySetting');
        return funKeySetting.filter(x => x.KeyType == "func");
    }
    getMasterKeySetting(name: string) {
        if (!this.cacheService.exist('funKeySetting')) {
            return [];
        }
        let funKeySetting = this.cacheService.get('funKeySetting');
        return funKeySetting.filter(x => x.KeyType == name);
    }

    getCookie() {
        var cookie = this._cookieService.get("imsposcookie");

        var j
        if (!cookie) {

            return undefined
        }

        return JSON.parse(cookie);

    }
    getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.getAuth().token })
        console.log({ headers: headers });
        return new RequestOptions({ headers: headers });
    }
    ngOnDestroy() {
        this._subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }

    // ClientTerminalValidation(){
    //    var CT= this._cookieService.get("imsposcookie");
    //    if(CT==null){return false;}
    //    else{
    //    }
    // }
}