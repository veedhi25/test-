import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ElementRef,
  ViewChild
} from "@angular/core";
import { FileUploaderService } from "./file-uploader-popup.service";
import { AlertService } from "../../services/alert/alert.service";
import { SpinnerService } from "../../services/spinner/spinner.service";
import { VoucherTypeEnum, TrnMain } from "../../interfaces/TrnMain";
import { TransactionService } from "../../Transaction Components/transaction.service";

@Component({
  selector: "file-uploader-popup",
  templateUrl: "./file-uploader-popup.component.html",
  styleUrls: ["../../../pages/Style.css", "../pStyle.css"]
})
export class FileUploaderPopupComponent implements OnChanges {

  @ViewChild("fileSelect") fileSelect: ElementRef;

  /** List Declaration  */
  selectedFileNames: string[] = [];
  isActive: boolean = false;
  dragging: boolean = false;
  doUploadFile: boolean = true;
  voucherType: VoucherTypeEnum;
  TrnMainObj: TrnMain = <TrnMain>{};
  /** Output  */

  @Output() onPopUpClose = new EventEmitter();
  @Output() onUploaded = new EventEmitter();

  /** Input  */

  @Input() popupsettings: FileUploaderPopUpSettings;
  @Input() summary: string;

  constructor(
    private fileImportService: FileUploaderService,
    private alertService: AlertService,
    private loadingService: SpinnerService,
    public _trnMainService: TransactionService,

  ) {
    this.TrnMainObj = _trnMainService.TrnMainObj;
    this.voucherType = this.TrnMainObj.VoucherType;
  }

  fileList: FileList = null;
  onFileChange($event) {
    this.fileList = $event.target.files;
    this.setSelectedFileNames();
  }

  setSelectedFileNames() {
    this.selectedFileNames = [];
    if (this.fileList == null) {
      return;
    }
    for (let i = 0; i < this.fileList.length; i++) {
      this.selectedFileNames.push(this.fileList[i].name)
    }
  }

  deleteSelectedItem() {
    // this.fileList.splice(i, 1);
    this.setSelectedFileNames();
  }

  onDragOver($event) {
    this.dragging = true;
    $event.preventDefault();
  }

  onDrop($event) {
    this.dragging = false;
    this.fileList = this.popupsettings.allowMultiple ? $event.dataTransfer.files : $event.dataTransfer.files;
    this.setSelectedFileNames();
    $event.preventDefault();
  }

  clearFile() {
    this.fileList = null;
  }

  importConfig() {
    if (this.fileList == null || this.fileList.length == 0) {
      this.alertService.info("Please Select File.");
      return;
    }

    let formData: FormData = new FormData();

    for (let i = 0; i < this.fileList.length; i++) {
      let file: File = this.fileList[i];
      formData.append(`file_${i}`, file, file.name);
    }
    if (this.doUploadFile) {
      // if (this.fileList.length > 0) {
      console.log('settings', this.popupsettings)
      console.log('formData', formData)

      this.loadingService.show("Uploading. Please Wait...");
      this.fileImportService.importSelectedFiles(this.popupsettings.uploadEndpoints, formData)
        .subscribe(
          res => {
            this.loadingService.hide();
            this.onUploaded.emit(res)
            this.hide();
          },
          error => {
            this.alertService.error(error);
            this.loadingService.hide();
            this.onUploaded.emit(null)
          }
        );
      // }
    } else {
      this.onUploaded.emit(this.fileList)
    }
  }

  downloadSample() {
    this.loadingService.show("Downloading Sample. Please Wait...");
    let filename = (this.popupsettings.filename == null || this.popupsettings.filename == "") ? "PO_SampleFile" : this.popupsettings.filename;
    this.fileImportService.downloadSampleFile(this.popupsettings.sampleFileUrl, filename, this.popupsettings.acceptFormat)
      .subscribe(
        data => {
          this.loadingService.hide();
          this.downloadFile(data);
        },
        (error) => {
          this.alertService.error(error);
          this.loadingService.hide();
        }
      );
  }

  downloadFile(response: any) {
    const element = document.createElement('a');
    element.href = URL.createObjectURL(response.content);
    element.download = response.filename;
    document.body.appendChild(element);
    element.click();
  }

  show(isUploadFile: boolean = true) {
    this.fileSelect.nativeElement.value = null;
    this.selectedFileNames = [];
    this.fileList = null;
    this.isActive = true;
    this.doUploadFile = isUploadFile;
  }

  hide() {
    this.fileSelect.nativeElement.value = null;
    this.isActive = false;
  }

  popupClose() {
    this.onPopUpClose.emit();
    this.hide()
  }

  ngOnChanges(changes: any) {
    if (!changes.popupsettings) {
      return;
    }
  }
}

export class FileUploaderPopUpSettings {
  title: string;
  uploadEndpoints: string;
  sampleFileUrl?: string;
  allowMultiple?: boolean = false;
  acceptFormat: string = "*";
  note?: string;
  filename?: string;
}
