import { OnInit, OnDestroy, ElementRef } from '@angular/core';
import { ExtendedKeyboardEvent } from './hotkey.model';
import { HotkeysService } from './hotkeys.service';
import 'mousetrap';
export declare class HotkeysDirective implements OnInit, OnDestroy {
    private _hotkeysService;
    private _elementRef;
    hotkeys: {
        [combo: string]: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent;
    }[];
    private mousetrap;
    private hotkeysList;
    private oldHotkeys;
    constructor(_hotkeysService: HotkeysService, _elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
