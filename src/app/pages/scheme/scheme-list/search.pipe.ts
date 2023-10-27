import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchData', pure: false })

export class SearchPipe implements PipeTransform {

  transform(data, query: string, option: string): any {
    if (data) {
      if (query) {
        if (option == "searchByName") {
          return data.filter(item => {
            const searchedQuery = query.replace(/[^A-Z0-9]/ig, '').toLowerCase();
            const comId = (item.SchemeName) ? (item.SchemeName).replace(/[^A-Z0-9]/ig, '').toLowerCase() : '';
            if (
              comId.indexOf(searchedQuery) !== -1
            ) {
              return item;
            }
          });
        }
      } else {
        return data;
      }
    }
  }
}
