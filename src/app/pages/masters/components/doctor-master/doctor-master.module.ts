import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table";
import { DoctorMasterRoutingModule } from "./doctor-master.routing";
import { DoctorMasterComponent } from "./doctor-master.component";
import { DoctorMasterListComponent } from "./doctor-master-list.component";
import { FileUploaderPopupModule } from "../../../../common/popupLists/file-uploader/file-uploader-popup.module";
import { TransactionService } from "../../../../common/Transaction Components/transaction.service";
import { IMSGridModule } from "../../../../common/ims-grid/ims-grid.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    DoctorMasterRoutingModule,
    FileUploaderPopupModule.forRoot(),
    IMSGridModule.forRoot()
  ],
  declarations: [
    DoctorMasterComponent,
    DoctorMasterListComponent
  ],
  providers: [TransactionService],

})
export class DoctorMasterModule { }
