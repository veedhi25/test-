import { Injectable } from '@angular/core'
@Injectable()
export class SalesmanService {
    
  smartTableData = [
    {
      salesmanId: 1,
      salesName: 'hiralal',
      address: 'Kirtipur',
      telNo: 4563727,
      mobileNo:9890467982,
      email:'hirala@ims.com',
   
    },
    {
     salesmanId: 2,
      salesName: 'Ram',
      address: 'Balkhu',
      telNo: 4548733,
      mobileNo:9804378323,
      email:'KRam@edu.com.np',
   
    },
    {
       salesmanId: 3,
      salesName: 'sujena',
      address: 'Kirtipur',
      telNo: 4632872,
      mobileNo:9863202930,
      email:'Shrestha_sujeen@ims.com',
   
    },
    {
      salesmanId: 4,
      salesName: 'kebin',
      address: 'Kirtipur',
      telNo: 4567238,
      mobileNo:986327032,
      email:'Kbinmaha32@gmail.com',
   
    },
    {
      salesmanId: 5,
      salesName: 'Utsav',
      address: 'Bafal',
      telNo: 4587322,
      mobileNo:98203236728,
      email:'utsav@ims.com',
    },
    {
      salesmanId: 6,
      salesName: 'Sujeep',
      address: 'Bhaktapur',
      telNo: 4738223,
      mobileNo:9863278322,
      email:'sujeep@gmail.com',
    },
    {
       salesmanId: 7,
      salesName: 'sujena',
      address: 'Kirtipur',
      telNo: 4632872,
      mobileNo:9863202930,
      email:'Shrestha_sujeen@ims.com',
    },
    {
    salesmanId: 8,
      salesName: 'Ram',
      address: 'Balkhu',
      telNo: 4548733,
      mobileNo:9804378323,
      email:'KRam@edu.com.np',
    },
    {
     salesmanId: 9,
      salesName: 'Sujeep',
      address: 'Bhaktapur',
      telNo: 4738223,
      mobileNo:9863278322,
      email:'sujeep@gmail.com',
    },
    {
     salesmanId: 10,
      salesName: 'Utsav',
      address: 'Bafal',
      telNo: 4587322,
      mobileNo:98203236728,
      email:'utsav@ims.com',
    },
    {
     salesmanId: 11,
      salesName: 'hiralal',
      address: 'Kirtipur',
      telNo: 4563727,
      mobileNo:9890467982,
      email:'hirala@ims.com',
    },
   
  ];
  
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