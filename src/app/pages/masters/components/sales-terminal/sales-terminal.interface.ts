export interface SalesTerminal {
        INITIAL: string;
        NAME: string;
        REMARKS: string;
        WAREHOUSE:  string;
        CURNO: number;
        SRCURNO: number;
        ACCOUNT: string;
        RATES: number;
        CATEGORY: string;
        VCURNO: number;
        VRCURNO: number;
        LOCK: number;
        SHOWINCRATE: number;
        SALESAC: string;
        SRETURNAC: string;
        VATAC: string;
        DISCOUNTAC: string;
        CASHAC: string;
        CDLIMIT: number;
        COUNTER_BL: number;
        DIVISION: string;
        IsInactive: boolean;
        HostName: string;
        MAC: string;
        // private ObservableCollection<CounterProduct> _mGroupList;
        // CounterProduct _selectedCounterProduct;
        IsSelected: boolean;
        // private ObservableCollection<SalesTerminal> _treeChildren;
        // private ITreeNode _Parent;
        IsExpanded: boolean;
        // private Warehouse _warehouse;
        // private Account _account;
        // private Category _category;
        // private Division _Division;
        // private ObservableCollection<SalesTerminal> _divisiongroupList;
        PRODUCTS: Product[];
        IsMatch: boolean;
        MGROUPLIST: CounterProduct[];
        
}

export interface CounterProduct {
         SN: string;
         DESCA: string;
         COUNTER: string;
         PRODUCT: string;
}      

export interface Division {
        initial: string;
        name: string;
}

export interface TerminalCategory {
         name: string;
} 

export interface SalesAC {
         name: string;
} 

export interface VatAC {
         name: string;
} 

export interface CashAC {
         name: string;
} 

export interface SalesReturnAC {
         name: string;
} 

export interface DiscountAC {
         name: string;
} 

export interface Product {
         PTYPENAME:string;
         NATURETYPE:natureType[];
         PTYPEID:number;
}

export class natureType{
        nameType:number;
}
