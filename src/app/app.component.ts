import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { ERouters } from '@enums/routes';

import { filter } from 'rxjs';
import MenuDashboardAdminComponent from './modules/dashboard-admin/components/menu-dashboard-admin/menu-dashboard-admin.component';
import MenuDesignSystemComponent from './modules/design-system/components/menu-design-system/menu-design-system.component';

@Component({
  selector: 'app-root',
  imports: [MenuDashboardAdminComponent, MenuDesignSystemComponent, RouterOutlet],
  templateUrl: 'app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AppComponent implements OnInit {
  #router = inject(Router);
  #cdr = inject(ChangeDetectorRef);
  #ERouters = signal(ERouters);

  public routerPath = signal('');
  public routerPathDashboardAdmin = `/${this.#ERouters().ADMIN}/${this.#ERouters().DASHBOARD}`;

  ngOnInit(): void {
    this.#router.events
      .pipe(filter((res) => res instanceof NavigationEnd))
      .subscribe({
        next: (next) => {
          this.routerPath.set(next.url);
          this.#cdr.detectChanges();
        },
      });
  }
}
