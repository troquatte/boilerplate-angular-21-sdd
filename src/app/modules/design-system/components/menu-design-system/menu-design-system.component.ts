import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ERouters } from '@enums/routes';
import { IconsSanitizerService } from '../../../shared/facades/icons-sanitizer.service';
import MenuLeftContainerComponent from '../../../shared/components/menu-left-container/menu-left-container.component';
import MenuBottomContainerComponent from '../../../shared/components/menu-bottom-container/menu-bottom-container.component';

@Component({
  selector: 'app-menu-design-system',
  imports: [
    RouterLink,
    MenuLeftContainerComponent,
    MenuBottomContainerComponent,
  ],
  templateUrl: './menu-design-system.component.html',
  styleUrl: './menu-design-system.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class MenuDesignSystemComponent {
  public icons = inject(IconsSanitizerService);
  public ERouters = ERouters;

  public navItems = [
    { id: 'foundations', label: 'Foundations' },
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'buttons', label: 'Buttons' },
    { id: 'forms', label: 'Forms' },
    { id: 'cards', label: 'Cards' },
    { id: 'tables', label: 'Tables' },
    { id: 'feedback', label: 'Feedback' },
  ];

  scrollTo(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
