import {
  Component, Input
} from "@angular/core";
import { MasterRepo } from "../../repositories";
import { NotificationService } from "../notification/notification.service";

@Component({
  selector: "order-ack",
  templateUrl: "./oder-notification-acknowledgement.component.html",
})
export class OrderNotificationAcknowledgementComponent {
  notificationForAck: any[] = [];

  constructor(public masterRepService: MasterRepo, private notificationService: NotificationService,
  ) {

    this.masterRepService.masterGetmethod("/getordernotificationlist").subscribe((res) => {
      if (res.status == "ok") {
        this.notificationForAck = res.result;
      }
    })
  }


  sendACK(index) {
    this.notificationService
      .markAsRead(this.notificationForAck[index].ID)
      .subscribe(res => {
        if (res.status == "ok") {
          this.notificationForAck.splice(index,1);
        }
      }, error => { });
  }





}
