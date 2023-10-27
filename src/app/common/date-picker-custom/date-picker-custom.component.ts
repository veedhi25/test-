import { Component, Input, OnInit, forwardRef, ElementRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import * as moment from 'moment';


@Component({
    selector: "date-picker",
    templateUrl: "./date-picker-custom.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        }
    ]

})
export class DatePickerComponent implements ControlValueAccessor, OnInit {

    @Input() ID: string = "";
    @Input() disabled: boolean = false;
    @Input() dateFormat: string = "DD/MM/YYYY"
    selectedDate: { startDate: moment.Moment };
    currentDate: string | Date | moment.Moment;
    maxlength: number = 10;
    private onChange: (value: string | moment.Moment) => void = () => { };
    private onTouched: (value: string | moment.Moment) => void = () => { }
    constructor(private elementRef: ElementRef) {

    }


    ngOnInit() {
        this.validateDateFormat();
    }
    writeValue(obj: any): void {
        this.currentDate = obj;
        this.selectedDate.startDate = moment(obj);
    }
    registerOnChange = (_fn: any): void => {

        this.onChange = _fn;
    }

    registerOnTouched = (_fn: any): void => {
        this.onTouched = _fn;
    }


    validateDateFormat = (): void => {
        let _format = this.dateFormat.replace('/', '');

        switch (_format) {
            case "MMYYYY":
                this.maxlength = 7;
                break;
            case "DDMMYYYY":
                this.maxlength = 10;
                break;

            default:
                this.maxlength = 10;
                break;
        }

    }


    IsNumeric(event) {
        var isShift = false
        if (event.keyCode == 16) {
            isShift = true;
        }
        //Allow only Numeric Keys.
        if (((event.keyCode >= 48 && event.keyCode <= 57) || event.keyCode == 8 || event.keyCode <= 37 || event.keyCode <= 39 || (event.keyCode >= 96 && event.keyCode <= 105)) && isShift == false) {
            if ((event.target.value.length == 2 || event.target.value.length == 5) && event.keyCode != 8) {
                event.target.value += '/';

            }

            return true;
        }
        else {
            return false;
        }
    };

    onDateEnterTab(event) {
        try {
            this.propagateChange(event.target.value)
        } catch (e) {
            
        }
    }




    onvalueChange(event) {
        try {
            if (event.startDate == null) return;
            let _selectedDate = new Date(event.startDate);
            if (_selectedDate.toDateString() == "Invalid Date") {
                return;
            }
            var year = _selectedDate.getFullYear();
            if (year != 1970) {
                if (moment.isMoment(event.startDate)) {
                    let datestr = moment(_selectedDate, this.dateFormat);
                    this.propagateChange(datestr);
                }
            }

        } catch (e) { console.log("calender Select Error", e) }
    }

    propagateChange(value: string | moment.Moment) {
        this.onChange(value);
        this.onTouched(value);

        this.elementRef.nativeElement.dispatchEvent(new CustomEvent('change',
            { detail: { 'value': value }, bubbles: true }));


        
        this.currentDate = value;
        this.selectedDate.startDate = moment(value);
    }



    show() {
        var element = document.getElementById("date" + this.ID) as HTMLElement;
        setTimeout(() => {
            element.click();
            element.focus();
        }, 0);
    }
}




