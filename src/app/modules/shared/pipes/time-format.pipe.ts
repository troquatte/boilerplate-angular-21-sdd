import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    if (numbers.length >= 3) {
      // Formato: 1900 -> 19:00
      const hours = numbers.substring(0, 2);
      const minutes = numbers.substring(2, 4);
      return `${hours}:${minutes}`;
    } else if (numbers.length === 2) {
      // Formato: 19 -> 19:00
      return `${numbers}:00`;
    } else if (numbers.length === 1) {
      // Formato: 1 -> 01:00
      return `0${numbers}:00`;
    }

    return value;
  }
}
