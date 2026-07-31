import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

// Enum
import { ERouters } from '@enums/routes';

import { IconsSanitizerService } from '../../facades/icons-sanitizer.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-menu-left-container',
  imports: [],
  templateUrl: './menu-left-container.component.html',
  styleUrl: './menu-left-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [],
  standalone: true,
})
export default class MenuLeftContainerComponent implements OnInit {
  readonly logoUrl = environment.MINIO.ASSETS + 'logo.png';
  #breakpointObserver = inject(BreakpointObserver);

  public icons = inject(IconsSanitizerService);
  public ERouters = ERouters;
  public isMenuOpen = signal(false);
  public isMobile = signal(false);

  ngOnInit(): void {
    this.#breakpointObserver
      .observe('(max-width: 845px)')
      .subscribe((result) => {
        if (
          result.breakpoints[Breakpoints.Handset] ||
          result.breakpoints[Breakpoints.Tablet] ||
          result.matches
        ) {
          this.isMenuOpen.set(false);
          this.isMobile.set(true);
        } else {
          this.isMenuOpen.set(true);
          this.isMobile.set(false);
        }
      });
  }

  public toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  public getMenuState() {
    if (this.isMobile()) {
      return this.isMenuOpen() ? 'mobile-open' : 'mobile-closed';
    }

    return this.isMenuOpen() ? 'open' : 'closed';
  }

  public closeMenu() {
    if (this.isMobile()) {
      this.isMenuOpen.set(!this.isMenuOpen());
    }
  }
}
