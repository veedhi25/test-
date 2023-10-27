import { Injectable } from '@angular/core'
@Injectable()
export class CategoryService {
    smartTableData = [
    {
      MENUID: 1,
      MENUCAT: 'item1',
      PARENT: 'product1',
      TYPE: 'G',
      
   
    },
    {
      MENUID: 2,
      MENUCAT: 'item2',
      PARENT: null,
      TYPE: 'A',
   
    },
    {
      MENUID: 3,
      MENUCAT: 'item3',
      PARENT: 'product3',
      TYPE: 'G',
   
    },
    {
      MENUID: 4,
      MENUCAT: 'item1',
      PARENT: 'product1',
      TYPE: 'G',
   
    },
    {
      MENUID: 5,
      MENUCAT: 'item1',
      PARENT: 'product1',
      TYPE: 'G',
    },
    {
      MENUID: 6,
      MENUCAT: 'item2',
      PARENT: null,
      TYPE: 'A',
    },
    {
      MENUID: 7,
      MENUCAT: 'item1',
      PARENT: 'product1',
      TYPE: 'G',
    },
    {
      MENUID: 8,
      MENUCAT: 'item2',
      PARENT: null,
      TYPE: 'A',
    },
    {
      MENUID: 9,
      MENUCAT: 'item1',
      PARENT: 'product1',
      TYPE: 'G',
    },
    {
      MENUID: 10,
      MENUCAT: 'item2',
      PARENT: null,
      TYPE: 'A',
    },
    {
      MENUID: 11,
      MENUCAT: 'item1',
      PARENT: 'product1',
      TYPE: 'G',
    },
   
  ];
  getCategory() {
        return [
            {
                PARENT: 'Transaction',
            },
            {
                 PARENT: 'Bank',
            },
            {
                PARENT: 'Cash',
            },
           ]
    };
  
  metricsTableData = [
    {
      image: 'app/browsers/chrome.svg',
      browser: 'Google Chrome',
      visits: '10,392',
      isVisitsUp: true,
      purchases: '4,214',
      isPurchasesUp: true,
      percent: '45%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/firefox.svg',
      browser: 'Mozilla Firefox',
      visits: '7,873',
      isVisitsUp: true,
      purchases: '3,031',
      isPurchasesUp: false,
      percent: '28%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/ie.svg',
      browser: 'Internet Explorer',
      visits: '5,890',
      isVisitsUp: false,
      purchases: '2,102',
      isPurchasesUp: false,
      percent: '17%',
      isPercentUp: false
    },
    {
      image: 'app/browsers/safari.svg',
      browser: 'Safari',
      visits: '4,001',
      isVisitsUp: false,
      purchases: '1,001',
      isPurchasesUp: false,
      percent: '14%',
      isPercentUp: true
    },
    {
      image: 'app/browsers/opera.svg',
      browser: 'Opera',
      visits: '1,833',
      isVisitsUp: true,
      purchases: '83',
      isPurchasesUp: true,
      percent: '5%',
      isPercentUp: false
    }
  ];
  

  getData(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.smartTableData);
      }, 2000);
    });
  }
}