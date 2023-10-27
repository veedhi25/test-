import { Component, Input } from '@angular/core';
import { TAcList } from '../../../../common/interfaces/Account.interface';
import { Product } from '../../../../common/interfaces/ProductItem';
import { MasterRepo } from '../../../../common/repositories/masterRepo.service';

@Component({
  selector: "acinfotab",
  template: `  <div style="width:650px;margin-left:5px">
               <table>
                 <tr>
                   <td></td>
                   <td>GST Inclusive</td>
                   <td>GST Exclusive</td>

                 </tr>
                 <tr>
                 <td>MRP</td>
                 <td><input type="text" class="form-control" [(ngModel)]="MRP"></td>
                 <td><input type="text" class="form-control"></td>

                 </tr>
                 <tr>
                 <td>Selling Price</td>
                 <td><input type="text" class="form-control"></td>
                 <td><input type="text" class="form-control"></td>

                 </tr>
                 <tr>
                 <td>Landing Price</td>
                 <td><input type="text" class="form-control"></td>
                 <td><input type="text" class="form-control"></td>

                 </tr>
</table>

                </div>`,
  styleUrls: ["../../../Style.css"],
})

export class AcInfoTabComponent {
  @Input() productObj: Product = <Product>{};
  @Input() MRP:any ;
  @Input() sellingPrice:any ;
  @Input() landingPrice:any ;


  ACList: TAcList[] = [];

  constructor(private masterService: MasterRepo) {

  }

  ngOnInit() {
    try {
      this.masterService.getAcList().subscribe(res => { this.ACList.push(<TAcList>res); });
    } catch (ex) {
      console.log(ex);
      alert(ex);
    }
  }

}