import { Injectable } from '@angular/core';
import { AuthService } from "./permission/index";
@Injectable()
export class AppSettings {
    //not in main api, need to add
    enableACCodeFocus = false;
    enableACNameFocus = true
    enableDateChange = true;
    //
    public get UserwiseDivision() {
        return this.getSettingFromCache('UserwiseDivision', 1);
    }
    public get DivisionWiseWarehouse() {
        return this.getSettingFromCache('DivisionWiseWarehouse', 1);
    }
    public get MembershipMode() {
        return this.getSettingFromCache('MembershipMode', 0)
    }
    public get CentralisedMembership() {
        return this.getSettingFromCache('CentralisedMembership', 0)
    }
    public get TERMINALWISESALESAC() {
        return this.getSettingFromCache('TERMINALWISESALESAC', 0)
    }
    public get TERMINALVCHR() {
        return this.getSettingFromCache('TERMINALVCHR', 0)
    }
    public get WeightedAverageCalc() {
        return this.getSettingFromCache('WeightedAverageCalc', 0)
    }
    public get SaveReceipeInProd() {
        return this.getSettingFromCache('SaveReceipeInProd', 0)
    }
    public get BarcodeInBilling() {
        return this.getSettingFromCache('BarcodeInBilling', 0)
    }
    public get ShowBSDate() {
        return this.getSettingFromCache('ShowBSDate', 0)
    } false
    public get IsTouchDisplay() {
        return this.getSettingFromCache('IsTouchDisplay', true)
    }
    public get RMode() {
        return this.getSettingFromCache('RMode', 1)
    }
    public get VATRate() {
        return this.getSettingFromCache('VATRate', 0.13)
    }
    public get ServiceTaxRate() {
        return this.getSettingFromCache('ServiceTaxRate', 0.1)
    }
    public get RoundOffPrecision() {
        return this.getSettingFromCache('RoundOffPrecision', 0)
    }
    public get TotPrintCharPerLine() {
        return this.getSettingFromCache('TotPrintCharPerLine', 48)
    }
    public get AbbInvoiceLimitAmount() {
        return this.getSettingFromCache('AbbInvoiceLimitAmount', 5000)
    }
    public get SalesAc() {
        return this.getSettingFromCache('SalesAc', 'DI01001')
    }
    public get PurchaseAc() {
        return this.getSettingFromCache('PurchaseAc', 'DE01002')
    }
    public get SalesReturnAc() {
        return this.getSettingFromCache('SalesReturnAc', 'DI01002')
    }
    public get PurchaseReturnAc() {
        return this.getSettingFromCache('PurchaseReturnAc', 'DE01003')
    }
    public get CashAc() {
        return this.getSettingFromCache('CashAc', 'AT01002')
    }
    public get VATAc() {
        return this.getSettingFromCache('VATAc', 'LB01003')
    }
    public get DiscountAc() {
        return this.getSettingFromCache('DiscountAc', 'IE01001')
    }
    public get RoundOffAc() {
        return this.getSettingFromCache('RoundOffAc', 'IE72697')
    }
    public get ServiceTaxAc() {
        return this.getSettingFromCache('ServiceTaxAc', 'LB77830V')
    }
    public get GblMemberShipMode() {
        return this.getSettingFromCache('GblMemberShipMode', 0)
    }
    public get GblCentralMembership() {
        return this.getSettingFromCache('GblCentralMembership', 0)
    }
    public get GblBarcodeWiseBilling() {
        return this.getSettingFromCache('GblBarcodeWiseBilling', true)
    }
    public get GblSaveReceipeInProd() {
        return this.getSettingFromCache('GblSaveReceipeInProd', 0)
    }
    public get EnableIndItemSalesManTag() {
        return this.getSettingFromCache('EnableIndItemSalesManTag', false)
    }
    public get GblShowBSDate() {
        return this.getSettingFromCache('GblShowBSDate', true)
    }
    public get GblTerminalWiseVoucher() {
        return this.getSettingFromCache('GblTerminalWiseVoucher', 0)
    }
    public get GblTerminalWiseSalesAc() {
        return this.getSettingFromCache('GblTerminalWiseSalesAc', 0)
    }
    public get Parent_Code_Of_RMD_ACLIST_For_SalesTerminal() {
        return this.getSettingFromCache('Parent_Code_Of_RMD_ACLIST_For_SalesTerminal', 'GOD')
    }
    public get GblProductWiseServiceCharge() {
        return this.getSettingFromCache('GblProductWiseServiceCharge', 0)
    }
    public get GblReplaceIndividualWithFlat() {
        return this.getSettingFromCache('GblReplaceIndividualWithFlat', 0)
    }
    public get GblSaveSeperateDiscountAccountInPurchase() {
        return this.getSettingFromCache('GblSaveSeperateDiscountAccountInPurchase', 0)
    }
    public get GblWeightedAverageCalc() {
        return this.getSettingFromCache('GblWeightedAverageCalc', 0)
    }
    public get GblShowSubledger() {

        return this.getSettingFromCache('GblShowSubledger', 1)
    }
    public get enableSubLedger() {
        return this.getSettingFromCache('enableSubLedger', false)
    }
    public get MultiWarehousePerTransaction() {
        return this.getSettingFromCache('MultiWarehousePerTransaction', 0)
    }
    public get AccountForBalancingOpeningBalance() {
        return this.getSettingFromCache('AccountForBalancingOpeningBalance', 'AT01002')
    }
    public get MultiplePurchaseAccount() {
        return this.getSettingFromCache('MultiplePurchaseAccount', 0)
    }
    public get GblShowPurchaseTypeAccount() {
        return this.getSettingFromCache('GblShowPurchaseTypeAccount', 0)
    }

    public get ShowBarcodeField() {
        return this.getSettingFromCache('ShowBarcodeField', 1)
    }
    public get GblEnableMCat1() {
        return this.getSettingFromCache('GblEnableMCat1', 0)
    }
    public get GblEnableMaxSQty() {
        return this.getSettingFromCache('GblEnableMaxSQty', 0)
    }
    public get GblItemWiseWarehouse() {
        return this.getSettingFromCache('GblItemWiseWarehouse', 0)
    }
    public get GblManualCode() {
        return this.getSettingFromCache('GblManualCode', 0)
    }
    public get GblDuplicateItem() {
        return this.getSettingFromCache('GblDuplicateItem', 0)
    }
    public get GblDuplicateGroup() {
        return this.getSettingFromCache('GblDuplicateGroup', 0)
    }
    public get GblEnableRateDiscount() {
        return this.getSettingFromCache('GblEnableRateDiscount', 1)
    }
    public get GblMultiBrandModel() {
        return this.getSettingFromCache('GblMultiBrandModel', 0)
    }
    public get GblEnableBarcodeDetails() {
        return this.getSettingFromCache('GblEnableBarcodeDetails', 0)
    }
    public get GblDivisionWiseBarcodeListing() {
        return this.getSettingFromCache('GblDivisionWiseBarcodeListing', 0)
    }
    public get GblAUTOBARCODEFROMPURCHASE() {
        return this.getSettingFromCache('GblAUTOBARCODEFROMPURCHASE', 0)
    }
    public get enableCostCenter() {
        return this.getSettingFromCache('enableCostCenter', true)
    }
    public get enableChequeInEntry() {
        return this.getSettingFromCache('enableChequeInEntry', false)
    }
    public get EnableParentMrpAsSalesRateOnEDI() {
        return this.getSettingFromCache('EnableParentMrpAsSalesRateOnEDI', false)
    }

    public get enableBranch() {
        return this.getSettingFromCache('enableBranch', true)
    }
    public get ENABLEBATCHPREVIEW() {
        return this.getSettingFromCache('ENABLEBATCHPREVIEW', "DISABLESINGLEBATCHPREVIEW")
    }
    public get ENABLEMULTICURRENCY() {
        return this.getSettingFromCache('ENABLEMULTICURRENCY', 0)
    }
    public get RETURN_NOTE() {
        return this.getSettingFromCache('RETURN_NOTE', "LB9999990")
    }
    public get VALIDATEAADHARNO() {
        return this.getSettingFromCache('VALIDATEAADHARNO', 0)
    }
    public get defaultCustomerAsLocal() {
        return this.getSettingFromCache('defaultCustomerAsLocal', 1)
    }
    public get enableTranOfScheduledNarcoticDrugWithLicenseOnly() {
        return this.getSettingFromCache('enableTranOfScheduledNarcoticDrugWithLicenseOnly', 1)
    }
    public get DefaultDivision() {
        if (this.UserwiseDivision == 1) {
            return this.getUserSettingFromCache("userDivision", '');
        }
        let Cookie = this.authservice.getCookie();
        let div
        if (Cookie != null) {
        }
        if (div) {
            return div;
        }
        return this.getSettingFromCache('DefaultDivision', 'MMX');
    }
    public get DefaultWarehouse() {
        if (this.DivisionWiseWarehouse == 1) {
            return this.getUserSettingFromCache('userWarehouse', '');
        }

        let Cookie = this.authservice.getCookie();
        let war;
        if (Cookie != null) { war = Cookie.Warehouse }
        if (war) {
            return war
        }
        return this.getSettingFromCache('DefaultWarehouse', 'Main Warehouse')
    }
    public get userDivisionList() {
        var defDiv = this.DefaultDivision;
        return this.getUserSettingFromCache("divisions", [defDiv]);
    }
    public get userWarehouseList() {
        var defware = this.DefaultWarehouse;
        return this.getUserSettingFromCache('warehouses', [defware]);
    }
    public get AppSalesBillType() {
        return this.getSettingFromCache('AppSalesBillType', 0)
    }
    public get AppWithServiceTax() {
        return this.getSettingFromCache('AppWithServiceTax', 0)
    }
    public get AppServiceTaxType() {
        return this.getSettingFromCache('AppServiceTaxType', 1)
    }
    public get DivisionWiseSalesBillNo() {
        return this.getSettingFromCache('DivisionWiseSalesBillNo', false)
    }
    public get CouterWiseSalesBillNo() {
        return this.getSettingFromCache('CouterWiseSalesBillNo', false)
    }
    public get GblDisplayServiceTax() {
        return this.getSettingFromCache('GblDisplayServiceTax', 0)
    }
    public get GblDisplayVAT() {
        return this.getSettingFromCache('GblDisplayVAT', false)
    }
    public get GblVatName() {
        return this.getSettingFromCache('GblVatName', 'GST')
    }
    public get GblRateMode() {
        return this.getSettingFromCache('GblRateMode', 0)
    }
    public get EnableVoucherSeries() {
        return this.getSettingFromCache('EnableVoucherSeries', 0)
    }
    public get EnableMultiFiscalYear() {
        return this.getSettingFromCache('EnableMultiFiscalYear', false)
    }
    public get GblEnableServiceCharge() {
        return this.getSettingFromCache('GblEnableServiceCharge', 0)
    }
    public get EnableRepeatedProduct() {
        return this.getSettingFromCache('EnableRepeatedProduct', 0)
    }
    public get EnableZeroRate() {
        return this.getSettingFromCache('EnableZeroRate', 0)
    }
    public get EnableCompulsoryBarcode() {
        return this.getSettingFromCache('EnableCompulsoryBarcode', 0)
    }
    public get EnablePurchaseBillCorrection() {
        return this.getSettingFromCache('EnablePurchaseBillCorrection', 0)
    }
    public get EnableCompulsoryPartyInTransaction() {
        return this.getSettingFromCache('EnableCompulsoryPartyInTransaction', 1)
    }
    public get EnableProductCondition() {
        return this.getSettingFromCache('EnableProductCondition', 0)
    }
    public get EnableCostCenter() {
        return this.getSettingFromCache('EnableCostCenter', 0)
    }
    public get GblShowItemButtons() {
        return this.getSettingFromCache('GblShowItemButtons', false)
    }
    public get HasExpiryDateInItem() {
        return this.getSettingFromCache('HasExpiryDateInItem', 0)
    }

    public get HasItemTypeInItem() {
        return this.getSettingFromCache('HasItemTypeInItem', 0)
    }
    public get ConsumptionAccount() {
        return this.getSettingFromCache('ConsumptionAccount', 'DE15507V')
    }
    public get SALESTYPE() {
        return this.getSettingFromCache('SALESTYPE', 'counter')
    }
    public get directCashCounterSales() {
        return this.getSettingFromCache('directCashCounterSales', 0)
    }

    public get printerMode() {
        return this.getSettingFromCache('PRINTERMODE', 0)
    }
    public get ENABLEOFFLINESALE() {
        return this.getSettingFromCache('ENABLEOFFLINESALE', 0)
    }

    public get CESS_PER() {
        return this.getSettingFromCache('CESS_PER', 0)
    }
    public get AccountBackEntryDays() {
        return this.getSettingFromCache('AccountBackEntryDays', 0)
    }



    public get IsMRPBilling() {
        return this.getSettingFromCache('IsMrpBilling', 0)
    }
    public get MRtoSI() {
        return this.getSettingFromCache('MRtoSI', 0)
    }
    public get DefaulQtyForBarcodeBilling(): number {
        return this.getSettingFromCache('DefaulQtyForBarcodeBilling', 1)
    }


    public get ShowPrintPreview(): boolean {
        if (this.getSettingFromCache('ShowPrintPreview', 0)) {
            return true;
        } else {
            return false;
        }
    }

    //method added here
    public get HideBatch(): boolean {
        if (this.getSettingFromCache('HIDEBATCH', false)) {
            return true;
        }
        else {
            return false;
        }
    }
    public get HideMfgDate(): boolean {
        if (this.getSettingFromCache('HIDEMFGDATE', false)) {
            return true;
        }
        else {
            return false;
        }
    }
    public get HideCostpriceInBatch(): boolean {
        if (this.getSettingFromCache('HideCostpriceInBatch', false)) {
            return true;
        }
        else {
            return false;
        }
    }
    public get CompanyNature(): number {
        if (this.getSettingFromCache('COMPANYNATURE', 0)) {
            let value: any = this.getSettingFromCache('COMPANYNATURE', 0);
            return value;
        }
        else {
            return 0;
        }
    }
    public get ShowPurchaseHistory(): boolean {
        if (this.getSettingFromCache('SHOWPURCHASEHISTORY', false)) {
            return true;
        }
        else {
            return false;
        }
    }
    public get ShowDeliveryBoy(): number {
        if (this.getSettingFromCache('SHOWDELIVERYBOY', 0)) {
            return 1;
        }
        else {
            return 0;
        }
    }
    public get BarcodePrinter(): number {
        if (this.getSettingFromCache('BarcodePrinter', 0)) {
            return 1;
        }
        else {
            return 0;
        }
    }

    public get HideExpDate(): boolean {
        if (this.getSettingFromCache('HIDEEXPDATE', false)) {
            return true;
        }
        else {
            return false;
        }
    }

    public get SHOWCOMBOITEMDETAILS(): boolean {
        if (this.getSettingFromCache('SHOWCOMBOITEMDETAILS', false)) {
            return true;
        }
        else {
            return false;
        }
    }
    public get EnableFocusOnSalesManOnBilling() {
        return this.getSettingFromCache('EnableFocusOnSalesManOnBilling', 0)
    }

    public get EnableLiveChatBot() {
        return this.getSettingFromCache('EnableLiveChatBot', 0)
    }
    public get EnableCustomSms() {
        return this.getSettingFromCache('EnableCustomSms', 0)
    }

    public get EnableSupplierwithoutPO() {
        return this.getSettingFromCache('EnableSupplierwithoutPO', 0)
    }

    public get PoNumberMandatoryFlag() {
        return this.getSettingFromCache('PoNumberMandatoryFlag', 0)
    }




    public get ENABLEBILLLOCKING() {
        return this.getSettingFromCache('ENABLEBILLLOCKING', 0)
    }





    public get ALLOWDECIMALINMRP(): boolean {
        return this.getSettingFromCache('ALLOWDECIMALINMRP', 0)
    }
    public get ALLOWDECIMALINQUANTITY(): boolean {
        return this.getSettingFromCache('ALLOWDECIMALINQUANTITY', 0)
    }






    public get DASHBOARDRIGHTS(): boolean {
        let right = this.authservice.checkUserRight("CANVIEWTRANSACTIONDASHBOARD");
        return right && right.value == "1" ? true : false
    }
    public get BILLWISEDISCOUNTRIGHTS(): boolean {
        let right = this.authservice.checkUserRight("BILLWISEDISCOUNT");
        return right && right.value == "1" ? true : false
    }
    public get ITEMWISEDISCOUNTRIGTS(): boolean {
        let right = this.authservice.checkUserRight("ITEMWISEDISCOUNT");
        return right && right.value == "1" ? true : false
    }

    public get EXPDATERIGHTS(): boolean {

        let right = this.authservice.checkUserRight("SHOWEXPDATEINSALE");
        return right && right.value == "1" ? true : false
    }
    public get MFGDATERIGTS(): boolean {
        let right = this.authservice.checkUserRight("SHOWMFGDATEINSALE");
        return right && right.value == "1" ? true : false
    }

    public get EnableTSC(): number {
        return this.getSettingFromCache('EnableTSC', 1)
    }
    public get TCS_PreviousYearTurnOverLimit(): number {
        return this.getSettingFromCache('TCS_PreviousYearTurnOverLimit', 100000000)
    }
    public get TCS_CustomerCurrentYearSalesLimit(): number {
        return this.getSettingFromCache('TCS_CustomerCurrentYearSalesLimit', 5000000)
    }
    public get TCS_PANUSER_PER(): number {
        return this.getSettingFromCache('TCS_PANUSER_PER', 0.075)
    }
    public get TCS_NONPANUSER_PER(): number {
        return this.getSettingFromCache('TCS_NONPANUSER_PER', 1)
    }
    public get disableRepeatProductInsale(): number {
        return this.getSettingFromCache('disableRepeatProductInsale', 0);
    }
    public get enableMultiSeriesInSales(): number {
        return this.getSettingFromCache('enableMultiSeriesInSales', 0);

    }

    public get enableZeroStockItemLoadInSoToSI(): number {
        return this.getSettingFromCache('enableZeroStockItemLoadInSoToSI', 0);

    }
    public get hideSuffixInBill(): number { return this.getSettingFromCache('hideSuffixInBill', 0) }
    public get SERVERSIDEITEMFETCHINSALES(): number { return this.getSettingFromCache('SERVERSIDEITEMFETCHINSALES', 0) }



    public get AUTOSCHEME(): boolean {
        return this.getSettingFromCache('AUTOSCHEME', 0)
    }
    public get ENABLEBATCHSRATE(): boolean {
        return this.getSettingFromCache('ENABLEBATCHSRATE', false)
    }




    public get ROUNDOFFLIMITERINSALES(): number {
        return this.getSettingFromCache('ROUNDOFFLIMITERINSALES', 0)
    }
    public get ENABLEROUNDOFFINSALES(): boolean {
        return this.getSettingFromCache('ENABLEROUNDOFFINSALES', false)
    }
    public get ROUNDOFFLIMITERINPURCHASE(): number {
        return this.getSettingFromCache('ROUNDOFFLIMITERINPURCHASE', 0)
    }
    public get ENABLEROUNDOFFINPURCHASE(): boolean {
        return this.getSettingFromCache('ENABLEROUNDOFFINPURCHASE', false)
    }
    public get ENABLEEXPIREDRETURNINPURCHASE(): boolean {
        return this.getSettingFromCache('ENABLEEXPIREDRETURNINPURCHASE', false)
    }
    public get ENABLEINDENTDELIVERY(): boolean {
        return this.getSettingFromCache('ENABLEINDENTDELIVERY', false)
    }
    public get ENABLEEXPIREDRETURNINSALES(): boolean {
        return this.getSettingFromCache('ENABLEEXPIREDRETURNINSALES', false)
    }
    public get ENABLELOYALTY(): boolean {
        return this.getSettingFromCache('ENABLELOYALTY', false)
    }
    public get enableSupplierWiseTermsAndConditionInPO(): boolean {
        return this.getSettingFromCache('enableSupplierWiseTermsAndConditionInPO', false);
    }
    public get enableAdvanceOptionInSalesOrder(): boolean {
        return this.getSettingFromCache('enableAdvanceOptionInSalesOrder', false);
    }

    public get gstIncludedIndDiscountOnPurchase(): number {
        return this.getSettingFromCache('gstIncludedIndDiscountOnPurchase', 0)
    }
    public get gstIncludedPrimaryDiscountOnPurchase(): number {
        return this.getSettingFromCache('gstIncludedPrimaryDiscountOnPurchase', 0)
    }
    public get gstIncludedSecondaryDiscountPurchase(): number {
        return this.getSettingFromCache('gstIncludedSecondaryDiscountPurchase', 0)
    }
    public get allowSupplierInIndent(): number {
        return this.getSettingFromCache('allowSupplierInIndent', 0)
    }
    public get allowPhoneInCustomerLOV(): number {
        return this.getSettingFromCache('allowPhoneInCustomerLOV', 0)
    }








    constructor(private authservice: AuthService) {

    }

    // public get DefaultWarehouse(){
    //     return this.Request.CookieService
    // }
    // if (Request.Cookies["UserSettings"] != null)
    // {
    //     string userSettings;
    //     if (Request.Cookies["UserSettings"]["Font"] != null)
    //     { userSettings = Request.Cookies["UserSettings"]["Font"]; }
    // }
    setSetting(settings) {

        for (var property in this) {
            if (this.hasOwnProperty(property)) {
                this[property] = settings[property];
            }
        }
    }

    getSettingFromCache(prop: string, defaultvalue: any) {
        let setting = this.authservice.getSetting();
        if (setting) {
            var ret = setting[prop];
            return ret;
        }
        return defaultvalue;

    }

    getUserSettingFromCache(prop: string, defaultvalue: any) {
        let userProfile = this.authservice.getUserProfile();
        if (userProfile) {
            var ret = userProfile[prop];
            return ret;
        }
        return defaultvalue;
    }
    getSettingFromCookie(prop: string, defaultvalue: any) {

        let Cookie = this.authservice.getCookie();
        if (Cookie) {
            var ret = Cookie.prop[prop];
            return ret;
        }
        return defaultvalue;
    }

}
