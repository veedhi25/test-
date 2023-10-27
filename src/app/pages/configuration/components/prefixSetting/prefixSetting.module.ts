import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PrefixSettingComponent} from './prefixSetting.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ReactiveFormsModule
    ],
    declarations: [
        PrefixSettingComponent
    ],
    exports: [
        PrefixSettingComponent
    ]
})
export class PrefixSettingModule {}