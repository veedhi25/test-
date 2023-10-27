import { Component } from '@angular/core';
import { TransactionService } from "./../../../../common/Transaction Components/transaction.service";
import { MasterRepo } from '../../../../common/repositories';

@Component({
    selector: "branch-out",
    templateUrl: "./branch-out.component.html",
    providers: [TransactionService],
  
})

export class BranchOutComponent {
  
    constructor(private masterService: MasterRepo, private _trnMainService: TransactionService) {
        this._trnMainService.initialFormLoad(8);
    }

    ngOnInit() {
       
    }

   
}
