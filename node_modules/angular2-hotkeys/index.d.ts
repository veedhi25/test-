import { ModuleWithProviders } from '@angular/core';
import { IHotkeyOptions } from './src/hotkey.options';
export * from './src/cheatsheet.component';
export * from './src/hotkey.model';
export * from './src/hotkey.options';
export * from './src/hotkeys.directive';
export * from './src/hotkeys.service';
export declare class HotkeyModule {
    static forRoot(options?: IHotkeyOptions): ModuleWithProviders;
}
