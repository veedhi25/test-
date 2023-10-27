import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { FileUploaderService } from "../../../../common/popupLists/file-uploader/file-uploader-popup.service";
import { MasterRepo } from "../../../../common/repositories";
import { AlertService } from "../../../../common/services/alert/alert.service";
import { SpinnerService } from "../../../../common/services/spinner/spinner.service";

@Component({
    templateUrl: "./DigitalSignature.component.html",
    styleUrls: ["./DigitalSignature.component.css"]
})



export class DigitalSignatureComponent implements OnInit {
    digitalSignatureUrl: any;
    file: FileList;


    constructor(private sanitizer: DomSanitizer, private _fileUploadService: FileUploaderService, private _alertService: AlertService, private _loadingService: SpinnerService, private _masterRepo: MasterRepo) {

        this._masterRepo.masterGetmethod_NEW("/getUserDigitalSignature").subscribe((res) => {
            if (res.status == "ok") {
                this.digitalSignatureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
            } else {

                this.digitalSignatureUrl = "";
            }
        })
    }



    ngOnInit() {

    }




    onFileChange($event) {
        this.file = $event.target.files;
        let reader = new FileReader();
        let digitalSignature = $event.target.files[0];

        if ($event.target.files && $event.target.files[0]) {
            reader.readAsDataURL(digitalSignature);
            reader.onload = () => {
                this.digitalSignatureUrl = reader.result;
            }
        }
    }




    onSaveDigitalSignature = (event) => {
        event.preventDefault();
        this._loadingService.show("Please wait while upload your digital signature.")
        if (this.file && this.file != null) {
            let fileformData: FormData = new FormData();
            let file: File = this.file[0];
            let filename = file.name
            fileformData.append(`file`, file, filename);
            this._fileUploadService.uploadPrescription('/uploadSignature', fileformData)
                .subscribe(
                    res => {

                        if (res.status == "ok") {
                            this._loadingService.hide();
                            this._alertService.success("Saved Successfully");
                        }
                    },
                    error => {

                        this._loadingService.hide();
                        this._alertService.error(error._body);
                    }
                );
        }
    }

}

