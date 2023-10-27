import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class AuthUserService {

  //  user authentication storage
  public static user: any
  public static userDataChanged: EventEmitter<any> = new EventEmitter()
  public static loggedIn: boolean = false;
  public static loggedInChanged: EventEmitter<any> = new EventEmitter();
  public static setLoggedInStatus(status) {
    AuthUserService.loggedIn = status;
    AuthUserService.loggedInChanged.emit(status);
  }
  public static getLoggedInStatus() {
    return AuthUserService.loggedIn;
  }


  public static setUser(user) {
    AuthUserService.user = user;
    AuthUserService.userDataChanged.emit(user);
  }

  public static getUser() {
    return AuthUserService.user
  }

}
