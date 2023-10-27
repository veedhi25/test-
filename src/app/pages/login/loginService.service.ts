import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { CacheService, UserToken, AuthService } from '../../common/services/permission';
import { Subscription } from 'rxjs/subscription';
import { Subject } from 'rxjs/subject';
import { GlobalState } from '../../global.state';
import { Router } from '@angular/router';
import { Item } from "../../common/interfaces/index";
import { IndexedDbWrapper } from "../../common/services";
import { AuthUserService } from '../../auth-user.service';
@Injectable()
export class LoginService implements OnInit, OnDestroy {
    private _subscriptions: Array<Subscription> = [];
    private apiUrl: string;
    UsersObj: any;
    sendMail = true;
    securityCode = true;
    newPassword = true;
    searchUser = true;
    loginpage = true
    email: any;
    constructor(private http: Http, private gblstate: GlobalState, private authSerice: AuthService, private router: Router, private dbWrapper: IndexedDbWrapper) {

    }

    ngOnInit() {

    }
    userProfile: Subject<any>;
    mockLogin(username: string, password: string) {

    }
    login(username: string, password: string) {
        let arr = this.gblstate.getGlobalSetting("apiUrl");
        if (arr) { this.apiUrl = arr[0] }

        let header = new Headers({ 'content-type': 'application/json' });
        let option = new RequestOptions({ headers: header })
        return this.http.post(this.apiUrl + '/jwt', { username: username, password: password, isOffline: 0 }, option)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.authSerice.setAuth(user);
                    this.gblstate.setGlobalSetting("LoggedIn", [true]);
                    this.gblstate.setGlobalSetting("userName", [username]);
                    this.gblstate.setGlobalSetting("View-Permission", ['Divisions', 'smartTables', 'addDivision']);
                    this.authSerice.setSessionVariable("LastProductChangeDateLocal", new Date('1990-01-01T00:00:00'));
                    this.authSerice.setSessionVariable("LastProductStockCheckDateLocal", new Date('1990-01-01T00:00:00'));
                    this.authSerice.setSessionVariable("isIYE", user.isIYE);
                    this.authSerice.setSessionVariable("isAYE", user.isAYE);
                    AuthUserService.setLoggedInStatus(true)
                } else {
                    AuthUserService.setLoggedInStatus(false);
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        let arr = this.gblstate.getGlobalSetting("apiUrl");
        if (arr) { this.apiUrl = arr[0] }
        let reqOptions = this.authSerice.getRequestOption();
        let sub = this.http.get(this.apiUrl + "/logout", reqOptions)
            .subscribe(res => {
                let data = res.json();
                if (data.status == 'ok') {
                    //this.router.navigate(['login']);
                }
            }, error => { console.log({ logoutError: error }); }
            )
        this._subscriptions.push(sub);
        this.authSerice.removeAuth();
        window.sessionStorage.removeItem('currentUser');
        this.gblstate.notifyDataChanged("LoggedIn", false);
        this.gblstate.setGlobalSetting("LoggedIn", [false]);
        this.gblstate.setGlobalSetting("userName", ['']);
        this.gblstate.setGlobalSetting("View-Permission", []);

    }

    ngOnDestroy() {
        this._subscriptions.forEach(sub => { sub.unsubscribe(); })
    }
    public getRequestOption() {
        let headers: Headers = new Headers({ 'Content-type': 'application/json', 'Authorization': this.authSerice.getAuth().token })
        return new RequestOptions({ headers: headers });
    }

    ForgetPwd(username: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let arr = this.gblstate.getGlobalSetting("apiUrl");
        if (arr) { this.apiUrl = arr[0] }
        console.log(this.apiUrl);
        console.log({ username: username });
        let header = new Headers({ 'content-type': 'application/json' });
        let option = new RequestOptions({ headers: header })
        this.http.post(this.apiUrl + '/jwtForget', { username: username }, option)
            .subscribe((response: Response) => {
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
    sendEmail(Email: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let arr = this.gblstate.getGlobalSetting("apiUrl");
        if (arr) { this.apiUrl = arr[0] }
        console.log(this.apiUrl);
        console.log({ username: Email });
        let header = new Headers({ 'content-type': 'application/json' });
        let option = new RequestOptions({ headers: header })
        this.http.post(this.apiUrl + '/SendEmail', { username: Email }, option)
            .subscribe((response: Response) => {
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
    emailCode(RandomNumber: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let arr = this.gblstate.getGlobalSetting("apiUrl");
        if (arr) { this.apiUrl = arr[0] }
        console.log(this.apiUrl);
        console.log({ RandomNumber: RandomNumber });
        let header = new Headers({ 'content-type': 'application/json' });
        let option = new RequestOptions({ headers: header })
        this.http.post(this.apiUrl + '/emailno', { RandomNumber: RandomNumber }, option)
            .subscribe((response: Response) => {
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
    updatePassword(password: string, username: string) {
        let res = { status: "error", result: "" };
        let returnSubject: Subject<any> = new Subject();
        let arr = this.gblstate.getGlobalSetting("apiUrl");
        if (arr) { this.apiUrl = arr[0] }
        console.log(this.apiUrl);
        console.log({ password: password });
        let header = new Headers({ 'content-type': 'application/json' });
        let option = new RequestOptions({ headers: header })
        this.http.post(this.apiUrl + '/updatePassword', { password: password, username: username }, option)
            .subscribe((response: Response) => {
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



}