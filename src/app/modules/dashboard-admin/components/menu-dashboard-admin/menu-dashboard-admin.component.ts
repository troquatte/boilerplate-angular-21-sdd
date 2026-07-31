import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Enum
import { ERouters } from '@enums/routes';

// Component
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
export default class MenuDashboardAdminComponent implements OnInit {
  public icons = inject(IconsSanitizerService);
  public ERouters = ERouters;

  public homeRouterLink = input<string[]>([ERouters.ADMIN, ERouters.DASHBOARD]);

  ngOnInit(): void {}
}
