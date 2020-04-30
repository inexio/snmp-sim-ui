import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "bytes",
})
export class BytesPipe implements PipeTransform {
    transform(value: any, precision: number = 1): any {
        if (value < 1 || isNaN(parseFloat(value)) || !isFinite(value)) {
            return "0 byte";
        }
        const units = ["byte", "kB", "MB", "GB", "TB", "PB"];
        const numb = Math.floor(Math.log(value) / Math.log(1000));
        const roundedValue = (value / Math.pow(1000, Math.floor(numb))).toFixed(precision); // eslint-disable-line no-restricted-properties
        return `${roundedValue} ${units[numb]}`;
    }
}
