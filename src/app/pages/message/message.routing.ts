import { Message } from './message.component';
import { RouterModule, Routes } from "@angular/router";
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
    {
      path: '',
      component: Message,
     
    }
  ];
  
  export const routing: ModuleWithProviders = RouterModule.forChild(routes);