export interface DeviceSetting {
    controlValue?: number;
    profileTypeLabel?: string;
    profileTypeValue?: string;
    profileNameLabel?: string;
    profileNameValue?: string;
    confirmShow?: boolean;
    DefaultPrint?:boolean;
    isCustomizedPrintDesignerPrint?:boolean;
}
export interface ProfileName {
    profileNameLabel?: string;
    profileNameValue?: string;
    controlValue?: number;
}