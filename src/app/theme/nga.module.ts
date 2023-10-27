import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BusyModule } from 'angular2-busy';
import { MdInputModule, MdAutocompleteModule, MdCheckboxModule, MdDatepickerModule, MdSelectModule, MaterialModule, MdDialogModule, MdNativeDateModule } from '@angular/material';

import {
  BaThemeConfig
} from './theme.config';

import {
  BaThemeConfigProvider
} from './theme.configProvider';

import {
  BaCard,
  BaPageTop,
} from './components';

import { BaCardBlur } from './components/baCard/baCardBlur.directive';

import {
  BaScrollPosition,
  BaSlimScroll,
  BaThemeRun
} from './directives';

import {
  TwoDigitNumber,
} from './pipes';

import {
  BaMenuService,
  BaThemeSpinner
} from './services';

import { SpinnerService } from '../common/services/spinner/spinner.service';
import { SimpleSuggestComponent } from '../common/simple-suggest/simple-suggest.component';
import { FilterPipe, SortByPipe } from './directives/pipes/pipes';
import { SharedModule } from '../common/shared.module';

const NGA_COMPONENTS = [
  BaCard,
  BaPageTop,
];

const NGA_DIRECTIVES = [
  BaScrollPosition,
  BaSlimScroll,
  BaThemeRun,
  BaCardBlur
];

const NGA_PIPES = [
  TwoDigitNumber,
  FilterPipe, SortByPipe
];

const NGA_SERVICES = [
  BaThemeSpinner,
  BaMenuService,
  SpinnerService
];

const NGA_VALIDATORS = [
];

@NgModule({
  declarations: [
    ...NGA_PIPES,
    ...NGA_DIRECTIVES,
    ...NGA_COMPONENTS,
    SimpleSuggestComponent

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule.forRoot(),
    ReactiveFormsModule,
    MdInputModule, MdSelectModule, MdAutocompleteModule,
    MdCheckboxModule, MaterialModule, MdDatepickerModule, MdDialogModule, MdNativeDateModule,
     BusyModule,

  ],
  exports: [
    ...NGA_PIPES,
    ...NGA_DIRECTIVES, FormsModule, CommonModule,
    ReactiveFormsModule,
    ...NGA_COMPONENTS,
    MdInputModule,
    MdSelectModule, MdAutocompleteModule,
    MdCheckboxModule, MaterialModule, MdDatepickerModule,
    BusyModule,
  ]
})
export class NgaModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: NgaModule,
      providers: [
        BaThemeConfigProvider,
        BaThemeConfig,
        ...NGA_VALIDATORS,
        ...NGA_SERVICES,

      ],
    };
  }
}
