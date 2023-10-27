import { Component, OnInit } from "@angular/core";
import { CHAT,  MEMBERS } from "../../common/interfaces/members";
import { MasterRepo } from "../../common/repositories";
import { AlertService } from "../../common/services/alert/alert.service";
import { AuthService } from "../../common/services/permission";
@Component({
    selector: 'message',
    templateUrl: './message.component.html',
    
  })
export class Message implements OnInit{
  membername : string;
  memberCompanyid:string;
  term :string;
  active : number;
  companyChat : CHAT[];
 members : CHAT[];

   chatHistory : CHAT = <CHAT>{}
   activeUser : CHAT=<CHAT>{}
   ReplyMessage: string;
   searchItem: string;
    constructor(public masterService : MasterRepo, public authService: AuthService, public alertService:AlertService){
      let userProfile = this.authService.getUserProfile();
    }
    ngOnInit(){
     this.getAllMsg();
     
      
    }

    onClickUser(memberMes) {
      let userProfile = this.authService.getUserProfile();
      this.activeUser = memberMes;
      
      
      this.masterService
        .masterGetmethod(
          "/getCompanyWiseMessage?receiverAcname=" +
          this.activeUser.ACNAME + "&senderCompanyId="+ userProfile.CompanyInfo.COMPANYID 
          + "&receiverCompanyName=" + memberMes.ACNAME
        )
        .subscribe(
          (res) => {
            if (res.status == "ok") {
              this.companyChat = res.result;
              
              
            } 
          },
          (error) => { },
          () => { }
        );
    }
    getAllMsg(){
      let userProfile = this.authService.getUserProfile();
      this.masterService.masterGetmethod("/getChatList?companyId="+userProfile.CompanyInfo.COMPANYID ).subscribe(
        (res)=>{
          this.members= res.result;
          console.log(this.members);
        }
      )
    }


    sendMessage(replyMessage: string) {
      let userProfile = this.authService.getUserProfile();
      this.activeUser.MESSAGE = replyMessage;
          this.activeUser.ACNAME=this.membername;
     this.activeUser.COMPANYID =userProfile.CompanyInfo.COMPANYID ;
    //  this.activeUser.COMPANYID_RECEIVER=this.memberCompanyid
     this.activeUser.TAG = "SEND"
     console.log(this.activeUser);
    
    let obj = {MESSAGE : replyMessage,ACNAME:this.membername,COMPANYID :userProfile.CompanyInfo.COMPANYID ,TAG :"SEND",COMPANYID_RECEIVER:this.memberCompanyid}
    
      this.masterService
        .masterPostmethod("/SendNewMessage", obj )
        .subscribe((res) => {
          if (res["status"] == "ok") {
            this.ReplyMessage = null;
            let msg = res.result;
            msg.TAG="SEND";
            msg.MESSAGE=this.activeUser.MESSAGE;
            msg.ACNAME=this.activeUser.ACNAME;
            msg.COMPANYID= this.activeUser.COMPANYID;
            msg.STAMP=this.activeUser.STAMP;
            msg.COMPANYID_RECEIVER=this.activeUser.COMPANYID_RECEIVER;
            
            this.companyChat.push(msg)
            
            
            
  
          } 
          else{
            this.alertService.error("Couldnot send message. Please check your internet connection")
          }
        });
    }

    searchUser(searchItem : string){
      let userProfile = this.authService.getUserProfile();
      
this.masterService.masterGetmethod("/searchUser?searchName=" + searchItem).subscribe(
  (res)=>{
    if (res["status"] == "ok" ) {
     
      this.members= res.result;
    
      this.memberCompanyid=res.result[0]["COMPANYID"]
      console.log(this.memberCompanyid);
    }
  }
)
    }
    onClickDisplayUser(index: string){
        this.membername= this.members[index].ACNAME
        this.memberCompanyid= this.members[index].COMPANYID
        
    }
    onClickActive(index: number) {
      this.active = index;
    }
    newLine(){
      alert("clicked")
    }
}