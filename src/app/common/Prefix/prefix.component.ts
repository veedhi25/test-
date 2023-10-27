import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap'
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";
import { PrefixService } from './prefix.service';
import { PREFIX } from "../../common/interfaces/Prefix.interface";
import { VoucherTypeEnum } from '../../common/interfaces/TrnMain';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { MasterRepo } from "../repositories/index";
@Component(
    {
        selector: 'SeriesDialog',
        templateUrl: './prefix.component.html',
        styles: [`
            .modal{
                padding-top:0px;
            }
        `],
        providers: [PrefixService],

    }
)
export class PrefixComponent {
    selectedVT: string;
    @Input() voucherType: VoucherTypeEnum = 0;
    @Output() sendPrefix = new EventEmitter();
    prefix: PREFIX = <PREFIX>{};
    prefixList: PREFIX[] = [];
    prefixes: PREFIX[] = [];
    prefixessubject: BehaviorSubject<PREFIX[]> = new BehaviorSubject([]);
    prefixesObservable$: Observable<PREFIX[]> = this.prefixessubject.asObservable();
    ngOnInit() {
        //  @ViewChild('orderModal') orderModal: ModalDirective;
        try {
            this.service.getVoucherType(this.voucherType).subscribe((data) => {
                //this.prefixes.push(<PREFIX[]>data);
                this.prefixessubject.next(<PREFIX[]>data);
            }, error => console.log({ Errorgetvouchertype: error }));
            var vname = this.masterService.getPrefixVname(this.voucherType);
            var vchr: string = VoucherTypeEnum[this.voucherType];
            this.selectedVT = vchr;
            this.prefix.VOUCHERNAME = this.selectedVT;
            this.prefix.VNAME = vname;
           
            this.sendPrefix.emit(this.prefix);
           
        } catch (ex) {
            console.log(ex);
            //alert(ex);
        }
    }

    constructor(protected service: PrefixService, private masterService: MasterRepo) {

    }

    getCurSequence() {
        try {
            this.sendPrefix.emit(this.prefix);
        } catch (ex) {
            console.log(ex);
            //alert(ex);
        }
    }


    prefixChanged() {
        try {
            this.sendPrefix.emit(this.prefix);
        } catch (ex) {
            console.log(ex);
            alert(ex);
        }
    }

}