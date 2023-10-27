import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ImsFormInputComponent } from "./components/form-input/ims-form-input.component";
import { ImsFormIMultiSelectComponent } from "./components/multi-select/ims-form-multi-select.component";
import { DynamicReportParam } from "./dynamicreportparam.component";
import { ImsFormFieldDirective } from "./ims-form-field.directive";
import {AngularMultiSelectModule} from '../../node_modules/angular4-multiselect-dropdown/'

@NgModule({
    declarations: [
        DynamicReportParam,
        ImsFormFieldDirective,
        ImsFormInputComponent,
        ImsFormIMultiSelectComponent

    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule,AngularMultiSelectModule ],
    exports: [DynamicReportParam],
    entryComponents: [
        ImsFormInputComponent,
        ImsFormIMultiSelectComponent
    ],
})
export class DynamicFormModule { }
