import { NgModule } from '@angular/core'
import { NgaModule } from "../../theme/nga.module";
import { ModalModule } from 'ng2-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from '../../node_modules/ng2-search-filter';
import { PoplistComponent } from './PopItemList/PopItems.component';
import { FocusDirective } from './focus.directive';
import { PopBatchComponent } from './PopBatchList/PopBatch.component';
import { PopCategoryComponent } from './PopupCategoryList/PopCategory.component';
import { PopItemGrpComponent } from './PopupItemGrpList/PopItemGrp.component';
import { PopSchemeChooserComponent } from './PopScheme/popscheme';
import { PopPartyChooserComponent } from './PopPartyList/popPartyList';
import { GenericPopUpComponent } from './generic-grid/generic-popup-grid.component';
import { PopBatchOldComponent } from './PopBatchList/PopBatchOld.component';
 

// import { PopupitemlistComponent } from './PopupItemList.componet';
@NgModule({
    imports: [
        NgaModule,ModalModule.forRoot(),
        NgxPaginationModule,
         Ng2SearchPipeModule,
        //  Ng2SmartTableModule
    ],
    declarations: [PoplistComponent,FocusDirective,PopBatchComponent,PopCategoryComponent,
    PopItemGrpComponent,PopSchemeChooserComponent
       // ,FilterPipe
       // , SortByPipe,
       , PopPartyChooserComponent,
    PopBatchOldComponent
    ], 
    exports: [
        PoplistComponent,PopBatchComponent,PopCategoryComponent,
          PopItemGrpComponent,PopSchemeChooserComponent
       // ,FilterPipe
       // , SortByPipe,
        ,PopPartyChooserComponent ,
        PopBatchOldComponent
    ],
    providers: []

})

export class popupListModule {
    
 }
