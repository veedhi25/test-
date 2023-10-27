import { Class } from "@angular/core"

   export class RFQMain
    {
            MODE :string
            CREATEDBY :string   
            STAMP :Date | string
            RFQNO :string   
            PHISCALID :string   
            COMPANYID :string   
            TRNDATE :Date | string   
            EDITDATE :Date | string
            REFDATE :Date | string
            STATUS :Boolean = false
            REFNO :String
            EXPECTEDDELIVERYDATE :Date | string
            RFQVALIDITY :Date | string
            REMARKS :String
            SUPPLIERLIST : string[]               
            ItemList : RFQPROD[]  = []      

    }
    export class RFQPROD
    {
            ID :number 
            DESCA :string    
            Indent :number 
            MAXQTY :number  
            MINQTY :number  
            MCODE :string   
            RFQNO : string
            STATUS :boolean   
            ALTUNIT :string 
            REFNO :string
    }