// src/app/validators/custom-validators.ts

import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FormValidatorsHelpers {
  static url(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();

    if (!value) return null;

    const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/i;

    return urlPattern.test(value) ? null : { invalidUrl: true };
  }
}
