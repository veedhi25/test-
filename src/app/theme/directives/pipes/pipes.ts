import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], key, term): any {
        if (key == null || key == undefined || key == "") return items;
        if (term == null || term == undefined || term == "") return items;
        return term
            ? items.filter(item =>
                item[key] != undefined
                && item[key] != null
                && item[key].toLowerCase().indexOf(term.toLowerCase()) !== -1)
            : items;
    }
}

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(items: any[], sortedBy: string): any {
        return items.sort((a, b) => { return b[sortedBy] - a[sortedBy] });
    }
}

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        let keys = [];
        for (let key in value) {
            keys.push(key);
        }
        return keys;
    }
}





@Pipe({ name: 'ReportFormatPipe' })
export class ReportFormatPipe implements PipeTransform {
    transform(value, args: string): any {
        switch (args) {
            case 'NUMERIC':
            case 'numeric':
                let parsedNumber: number = 0;
                if (
                    value == undefined ||
                    value == null ||
                    value == "" ||
                    value == "Infinity" ||
                    value == "NaN" ||
                    isNaN(parseFloat(value))
                ) {
                    parsedNumber = 0;
                }
                parsedNumber = parseFloat(value);
                return new DecimalPipe('en-US').transform(parsedNumber, '1.2-2')
            default:
                return value
        }
    }
}
