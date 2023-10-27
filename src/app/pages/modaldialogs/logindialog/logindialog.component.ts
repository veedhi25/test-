import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
    selector:'login-dialog',
    styleUrls:['./logindialog.component.css'],
    template:`
    <login (signedIn)="loginResult($event)" toUrl="test"></login>
   
`
})
export class LoginDialog{
    constructor(public dialogref:MdDialogRef<LoginDialog>){

    }

    public loginResult(res){
        this.dialogref.close(res);
    }
        
}