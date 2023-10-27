import { Component, OnInit, Input, forwardRef, HostListener, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from "@angular/forms";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'app-simple-suggest',
    templateUrl: 'simple-suggest.component.html',
    styleUrls: ['simple-suggest.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SimpleSuggestComponent),
            multi: true
        }
    ],
})
export class SimpleSuggestComponent implements OnInit, ControlValueAccessor {

    @Input() labelKey: string;
    @Input() valueKey: string;
    @Input() options: Array<{}> = [];
    @Input() default: string = "Search Here...";
    @Input() align: any = 'down';
    @Input() textAlign: any = 'left';
    @Input() resetonselect: boolean = false;
    value: any;
    public expand = false;
    public suggestions = [];
    public selectedIndex = 0;
    public keypressed: boolean = false;
    public keyPressedEnter: boolean = false;
    public filterForm: FormGroup;
    onChange: any = () => { };
    onTouch: any = () => { };


    clickedInside($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
    }

    @HostListener('document:click', ['$event']) clickedOutside($event) {
        this.expand = false
    }

    public search = new FormControl();
    public filter = new FormControl();


    constructor(private _fb: FormBuilder) {
        this.filterForm = this._fb.group({
            filter: this.filter
        })
        this.suggestions = this.options;

    }

    ngOnInit() {
        /**
         * Validatewhether label key and value key are of type @string
         */
        if (typeof this.valueKey !== "string") {
            throw Error("valueKey must be a string type.");
        }
        if (typeof this.labelKey !== "string") {
            throw Error("labelKey must be a string type.");
        }
        if (this.valueKey === "") {
            throw Error("Please provide a valid valueKey.");
        }
        if (this.labelKey === "") {
            throw Error("Please provide a valid labelKey.");
        }

        this.search.valueChanges.subscribe((res) => {
            this.suggestions = [];
            for (let i in this.options) {
                if (this.options[i][this.valueKey].toUpperCase().replace("-", " ")
                    .includes(this.search.value.toUpperCase()) || this.options[i][this.labelKey].toUpperCase().replace("-", " ")
                        .includes(this.search.value.toUpperCase())) {
                    this.suggestions.push(this.options[i])
                }
            }
        })

        if (!this.suggestions.length) {
            this.suggestions = this.options;
        }

    }

    writeValue = (obj: any): void => {
        if (typeof obj === "object") {
            this.search.setValue("");
            return;
        }
        this.search.setValue(obj);
    }



    registerOnChange = (_fn: any): void => {

        this.onChange = _fn;
    }

    registerOnTouched = (_fn: any): void => {
        this.onTouch = _fn;
    }




    keyUp = (): void => {
        if (this.selectedIndex > 0) {
            this.selectedIndex--;
            return;
        }

    }

    keyDown = (): void => {
        if (this.selectedIndex < this.suggestions.length - 1) {
            this.selectedIndex++;
            return;
        }

    }


    filterWord = (res: any): void => {
        if (res === "") {
            this.suggestions = this.options;
            this.expand = true;
            this.selectedIndex = 0;
            return;
        }
        this.suggestions = [];
        for (let i in this.options) {
            if (this.options[i][this.valueKey].toUpperCase().replace("-", " ")
                .includes(res.toUpperCase()) || this.options[i][this.labelKey].toUpperCase().replace("-", " ")
                    .includes(res.toUpperCase())) {
                this.suggestions.push(this.options[i])
            }
        }
    }

    setSearch = (value: any): void => {
        this.search.setValue(value[this.labelKey]);
        this.filterForm.controls['filter'].setValue(value[this.valueKey]);
        this.propagateChange(value[this.valueKey]);
    }

    setSearchKeyword = (): void => {
        let label = this.suggestions[this.selectedIndex][this.labelKey];
        let value = this.suggestions[this.selectedIndex][this.valueKey];
        this.search.setValue(label);
        this.filterForm.controls['filter'].setValue(value);
        this.propagateChange(value);
    }


    propagateChange = (value: any) => {
        this.onChange(value);
        this.expand = false;
        this.selectedIndex = 0;
        if (document.getElementById("ngx-simple-suggest")) {
            document.getElementById("ngx-simple-suggest").blur();
        }
        this.search.setValue("");

    }

}