import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EIconsCourses } from './../enum/EIconsCourses.enum';
import { EIcons } from '../enum/EIcons.enum';

@Injectable({
  providedIn: 'root',
})
export class IconsSanitizerService {
  #sanitizer = inject(DomSanitizer);
  // Icons Logout
  get iconLogout(): SafeHtml {
    return this.#sanitizer.bypassSecurityTrustHtml(EIcons.LOGOUT);
  }

  get iconCoursesHome(): SafeHtml {
    return this.#sanitizer.bypassSecurityTrustHtml(EIconsCourses.HOME);
  }

  get iconLogoutMenu(): SafeHtml {
    return this.#sanitizer.bypassSecurityTrustHtml(EIcons.LOGOUT_MENU);
  }

  get iconHouse(): SafeHtml {
    return this.#sanitizer.bypassSecurityTrustHtml(EIconsCourses.HOUSE);
  }

  get iconHamburguer(): SafeHtml {
    return this.#sanitizer.bypassSecurityTrustHtml(EIconsCourses.HAMBURGUER);
  }

  get iconClose(): SafeHtml {
    return this.#sanitizer.bypassSecurityTrustHtml(EIconsCourses.CLOSE);
  }
}
