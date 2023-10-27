import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'ControlShowHide',
    pure: true
})
export class ControlShowHide implements PipeTransform {
    constructor() {
    }

    transform(fieldName: any, masterFormfieldSetting: any[] = []): boolean {
        let active: boolean = this.showButton(fieldName, masterFormfieldSetting)
        return active;
    }


    showButton(controlName, masterFormfieldSetting): boolean {
        let x = masterFormfieldSetting.filter(x => x.values == controlName)[0];
        if (x !== null && x !== undefined) {
            return !x.selected;
        }

        return true;
    }
}
