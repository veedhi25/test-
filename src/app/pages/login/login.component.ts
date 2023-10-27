import { CookieService } from 'angular2-cookie/core';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import 'style-loader!./login.scss';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './loginService.service';
import { Http } from '@angular/http';
import { ModalDirective } from 'ng2-bootstrap';
import { MasterRepo } from '../../common/repositories';
export var var1: string;
@Component({
  selector: 'login',
  templateUrl: './login.html',
  providers: [Http]
})
export class Login implements OnInit {
  @Output('signedIn') signedIn = new EventEmitter();
  @Input('toUrl')
  set toUrl(value: string) {
    this._toUrl = value;
  }
  @Output() filterData = new EventEmitter();
  private _toUrl: string = '';
  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public submitButtonStatus: boolean = true;
  returnUrl: string;
  signOut;
  @ViewChild('childModal') childModal: ModalDirective;
  DialogMessage: string = " "
  SendMail = true;
  SearchUser = true;
  securityCode = true;
  newPassword = true
  constructor(fb: FormBuilder, private route: ActivatedRoute, private router: Router, private loginService: LoginService, private _cookieService: CookieService) {
    try {
      this.form = fb.group({
        'email': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      });

      this.email = this.form.controls['email'];
      this.password = this.form.controls['password'];
    } catch (ex) {
      alert(ex);
    }

  }
  ngOnInit() {
    try {
      let logout = this.route.snapshot.params['logout'];
      this.returnUrl = this.route.snapshot.params['returnUrl'] || '/';
      if (logout) {
        this.onLogOut();
      }
    } catch (ex) {
      alert(ex);
    }
    this.SendMail = false;
    this.SearchUser = false;
    this.loginService.sendMail = false;
    this.securityCode = false;
    this.loginService.securityCode = false;
    this.loginService.newPassword = false
    this.loginService.searchUser = false;
    this.loginService.loginpage = true;
  }
  public onSubmit(values: Object): void {
    try {
      this.submitted = true;
      if (this.form.valid) {
        this.submitButtonStatus = false
        this.loginService.login(this.email.value, this.password.value)
          .subscribe(
            data => {
              if (this._toUrl != '') {
                this.signedIn.emit("logged In");
                this.submitButtonStatus = true
              }
              else {
                if (this.returnUrl == "/")
                  this.returnUrl = "/pages/dashboard"
                this.router.navigate([this.returnUrl]);
                this.submitButtonStatus = true;
              }
            },
            error => {
              var errorObj = JSON.parse(error._body);
              this.submitButtonStatus = true
              this.DialogMessage = errorObj.result ? errorObj.result : "!!Invalid Username Or Password!!!"
              this.childModal.show();
              setTimeout(() => {
                this.childModal.hide();
              }, 4000)
              this.submitted = false;
            }
          )

      }
    } catch (ex) {
      alert(ex);
    }
  }

  public onLogOut(): void {
    this.loginService.logout();
  }
  ForgetPassword() {
    this.loginService.searchUser = true;
    this.loginService.loginpage = false;
  }

}
