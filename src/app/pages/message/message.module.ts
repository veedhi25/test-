import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';


import { routing }       from './message.routing';
import { ModalModule } from 'ng2-bootstrap';
import { Message } from './message.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
    ModalModule.forRoot()
  ],
  declarations: [Message]
  ,
  exports:[]
})
export class MessageModule {}
