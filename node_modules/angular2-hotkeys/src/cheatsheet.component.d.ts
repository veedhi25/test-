import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { HotkeysService } from './hotkeys.service';
import { Hotkey } from './hotkey.model';
export declare class CheatSheetComponent implements OnInit, OnDestroy {
    private hotkeysService;
    helpVisible: boolean;
    title: string;
    subscription: Subscription;
    hotkeys: Hotkey[];
    constructor(hotkeysService: HotkeysService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    toggleCheatSheet(): void;
}
