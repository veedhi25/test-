import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../common/services/permission';
import { Http } from '@angular/http';
@Component({
  selector: 'pages-footer',
  template: `
    <footer class="al-footer clearfix sticky-footer" style="padding:0px">
    <div >
    <table id="BlueHeaderResizableTable" #reportHtmlTable
    style="font-size:10px; width: 100%; overflow-x :auto;" class="reportTabel">
    <tbody style="width: fit-content">
        <tr>
        <td style="height:22px;" width="200px">
         <strong> Powered By</strong> Bharuwa Solutions Pvt.Ltd
        </td>
        <td style="height:22px;" width="100px"> <strong>v</strong>{{version}}</td>
        <td style="height:22px;" width="400px" >
        <strong> Company</strong> &nbsp;{{loggedInUserDetail.CompanyInfo.NAME}}
          
        </td>
        <td style="height:22px;" width="300px" > 
          <strong>Location</strong> &nbsp;&nbsp;{{loggedInUserDetail.CompanyInfo.ADDRESS}} 
          
        </td>
        <td style="height:22px;" width="110px" >
          <strong>Login User</strong>&nbsp;{{loggedInUserDetail.username}}
        </td>
        </tr>
      </tbody>
    </table>
    </div>
    </footer>
    `,
  styles: [
    `
        
    .ims-scrollable-table .reportTabel tr:hover {
      background:none;
  }


  td{
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    border:none;
  }
        `
  ]
})
export class Footer implements OnInit {
  public loggedInUserDetail: any;
  version: string;
  constructor(private cacheService: CacheService, private http: Http) {

  }
  ngOnInit() {
    this.loggedInUserDetail = this.cacheService.get('USER_PROFILE')
    try {
      this.http.get("/appConfig.json")
        .map(res => res.json())
        .subscribe(data => {
          this.version = data.Version;
        }, error => {

        });
    } catch (error) { }
  }
}
