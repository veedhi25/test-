

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {

    transform(items, searchTerm) {
        let filteredList = [];
        if (searchTerm) {
            let newSearchTerm = !isNaN(searchTerm) ? searchTerm.toString() : searchTerm.toString().toUpperCase();
            let prop;
            return items.filter(item => {
                for (let key in item) {
                    if (isNaN(item[key]) && item[key] != null && item[key] != undefined) {
                        prop = item[key].toString().toUpperCase();
                        if (prop.indexOf(newSearchTerm) > -1) {
                            filteredList.push(item);
                            return filteredList;
                        }

                    } else if (item[key] != null && item[key] != undefined) {
                        prop = item[key].toString();
                        if (prop.indexOf(newSearchTerm) > -1) {
                            filteredList.push(item);
                            return filteredList;
                        }
                    }


                }
            })
        }
        else {
            return items;
        }
    }
}

