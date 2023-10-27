import { Injectable } from '@angular/core'
@Injectable()
export class UnitService {
    smartTableData = [
    {
      UNITID: 1,
      UNITNAME: 'Unit1',
  },
    {
      UNITID: 2,
      UNITNAME: 'Unit2',
    },
   {
      UNITID: 3,
      UNITNAME: 'Unit1',
  },
    {
      UNITID: 4,
      UNITNAME: 'Unit2',
    },
   {
      UNITID: 5,
      UNITNAME: 'Unit1',
  },
    {
      UNITID: 6,
      UNITNAME: 'Unit2',
    },
   {
      UNITID: 7,
      UNITNAME: 'Unit1',
  },
    {
      UNITID: 8,
      UNITNAME: 'Unit2',
    },
   {
      UNITID: 9,
      UNITNAME: 'Unit1',
  },
    {
      UNITID: 10,
      UNITNAME: 'Unit2',
    },
   {
      UNITID: 11,
      UNITNAME: 'Unit1',
  },
    {
      UNITID: 12,
      UNITNAME: 'Unit2',
    },
  ];
  getCategory() {
        return [
            {
                name: 'Transaction',
            },
            {
                 name: 'Bank',
            },
            {
                name: 'Cash',
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