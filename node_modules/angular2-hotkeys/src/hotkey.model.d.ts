export interface ExtendedKeyboardEvent extends KeyboardEvent {
    returnValue: boolean;
}
export declare class Hotkey {
    combo: string | string[];
    callback: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent | boolean;
    allowIn: string[];
    description: string | Function;
    action: string;
    persistent: boolean;
    _formatted: string[];
    static symbolize(combo: string): string;
    /**
     * Creates a new Hotkey for Mousetrap binding
     *
     * @param {string}   combo       mousetrap key binding
     * @param {string}   description description for the help menu
     * @param {Function} callback    method to call when key is pressed
     * @param {string}   action      the type of event to listen for (for mousetrap)
     * @param {array}    allowIn     an array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
     * @param {boolean}  persistent  if true, the binding is preserved upon route changes
     */
    constructor(combo: string | string[], callback: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent | boolean, allowIn?: string[], description?: string | Function, action?: string, persistent?: boolean);
    readonly formatted: string[];
}
