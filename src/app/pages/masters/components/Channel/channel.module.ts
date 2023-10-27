import { Ng2SmartTableModule } from "../../../../node_modules/ng2-smart-table/src/ng2-smart-table.module";
import { NgModule } from "@angular/core";
import TreeModule from "angular-tree-component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GenericPopupGridModule } from "../../../../common/popupLists/generic-grid/generic-popup-grid.module";
import { NgaModule } from "../../../../theme/nga.module";
import { ModalModule } from "ngx-bootstrap";
import { ChannnelRoutingModule } from "./channel.routing";
import { ChannelListComponent } from "./channelList.comonent";
import { ChannelComponent } from "./channel.component";

@NgModule({
  imports: [
    TreeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChannnelRoutingModule,
    GenericPopupGridModule.forRoot(),
    NgaModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),

  ],
  declarations: [
    ChannelListComponent,
    ChannelComponent
  ],
})
export class ChannelModule { }
