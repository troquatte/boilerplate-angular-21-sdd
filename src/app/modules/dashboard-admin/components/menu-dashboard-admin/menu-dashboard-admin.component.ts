import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { finalize } from 'rxjs';

// Enum
import { ERouters } from '@enums/routes';

// Component
import { AuthService } from '../../../auth/services/auth.service';
import { IconsSanitizerService } from '../../../shared/facades/icons-sanitizer.service';
import MenuLeftContainerComponent from '../../../shared/components/menu-left-container/menu-left-container.component';
import MenuBottomContainerComponent from '../../../shared/components/menu-bottom-container/menu-bottom-container.component';

@Component({
  selector: 'app-menu-dashboard-admin',
  imports: [
    RouterLink,
    RouterLinkActive,
    MenuLeftContainerComponent,
    MenuBottomContainerComponent,
  ],
  templateUrl: './menu-dashboard-admin.component.html',
  styleUrl: './menu-dashboard-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class MenuDashboardAdminComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public icons = inject(IconsSanitizerService);
  public ERouters = ERouters;

  public homeRouterLink = input<string[]>([ERouters.ADMIN, ERouters.DASHBOARD]);

  onLogout(): void {
    this.authService.logout()
      .pipe(finalize(() => this.router.navigate(['/auth/login'])))
      .subscribe();
  }
}
