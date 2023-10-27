import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { AlertService } from '../../../common/services/alert/alert.service';
import { SpinnerService } from '../../../common/services/spinner/spinner.service';
import { MasterRepo } from '../../../common/repositories';
import { Scheme } from '../../../common/interfaces/Scheme';


@Component({
  selector: 'scheme-list',
  templateUrl: './scheme-list.component.html',
  styleUrls: ['./scheme-list.component.css']
})

export class SchemeListComponent /*extends AppComponentBase implements OnInit*/ {
  errorMessage: string;
  isLoader = true;
  filter: any;
  currentPage = 1;
  totalCount: number;
  itemsPerPage = 10;
  offset = 0;
  salesmanLists: any[] = [];
  source: ServerDataSource;
  schemeList: Array<Scheme> = [];
  searchByName: string = "searchByName";


  constructor(private router: Router,
    public alertService: AlertService,
    public spinner: SpinnerService,
    public masterRepo: MasterRepo,
    public injector: Injector) {
  }

  ngOnInit() {
    this.masterRepo.getMasterSchemeList().subscribe((res: any) => {
      if (res) {
        this.schemeList = res ? res : [];
      } else {
        this.schemeList = [];
      }
    }, err => {
      this.schemeList = [];
    })

  }

  onEditClicked(scheme) {
    try {
      this.router.navigate([
        './pages/configuration/scheme/add-scheme',
        { schemeID: scheme.DisID, schemeType: scheme.SchemeType, mode: 'edit', returnUrl: this.router.url }
      ]);
    } catch (ex) {
      this.alertService.error(ex);
    }
  }

  onViewClick(scheme): void {
    try {
      this.router.navigate([
        "./pages/configuration/scheme/add-scheme",
        {
          schemeID: scheme.DisID,
          schemeType: scheme.SchemeType,
          mode: 'view',
          returnUrl: this.router.url
        }
      ]);
    } catch (ex) {
      alert(ex);
    }
  }

  onDeleteClicked(scheme) {
    if (confirm("Are you sure you want to delete " + scheme.SchemeName + " ?")) {
      this.masterRepo.deleteScheme(scheme.DisID, scheme.SchemeType).subscribe((res: any) => {
        if (res.status == 'ok') {
          this.alertService.info(res.result);
          this.masterRepo.getMasterSchemeList().subscribe((res: any) => {
            if (res) {
              this.isLoader = false;
              this.schemeList = res ? res : [];
            } else {
              this.schemeList = [];
              this.errorMessage = "something is wrong."
            }
          })
        } else {
          this.alertService.error(res.result.error);
        }
      }, error => {
        this.alertService.error(error.error);

      });
    }
  }


  syncScheme(scheme) {
    this.spinner.show("Syncing data please wait..")
    this.masterRepo.masterGetmethod_NEW(`/syncschemetooutlet?schemeid=${scheme.DisID}`).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == "ok") {
        this.alertService.success("Success. Data sync initiated. It may take a while to reflect on all outlets.Please have patience.")
      }
    }, error => {
      this.spinner.hide();
      this.alertService.error(error.statusText);
    })
  }


  salesmanPagination(event) {

  }

  addScheme() {
    try {
      this.router.navigate(['./pages/configuration/scheme/add-scheme', { mode: 'add', returnUrl: this.router.url }]);
    } catch (ex) {
    }
  }

  schemePagination(event) {
    this.currentPage = event;
    const t = this;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
    }, 500);
  }


  enableSchemeToOutlet() {
    let userprofiles = this.masterRepo.userProfile;
    if (userprofiles && userprofiles.CompanyInfo.isHeadoffice == 1) {
      return true;
    }
    return false;
  }

  SyncSchemeToOutlet() {
    this.spinner.show("Syncing data please wait..")
    this.masterRepo.masterGetmethod_NEW("/syncschemetooutlet").subscribe((res: any) => {
      this.spinner.hide();
      if (res.status == "ok") {
        this.alertService.success("Success. Data sync initiated. It may take a while to reflect on all outlets.Please have patience.")
      }
    }, error => {
      this.spinner.hide();
      this.alertService.error(error.statusText);
    })
  }
}


