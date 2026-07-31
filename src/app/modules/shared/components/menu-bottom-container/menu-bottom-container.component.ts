import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ERouters } from '@enums/routes';
import { IconsSanitizerService } from '../../facades/icons-sanitizer.service';

@Component({
  selector: 'app-menu-bottom-container',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu-bottom-container.component.html',
  styleUrl: './menu-bottom-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export default class MenuBottomContainerComponent implements OnInit {
  #activatedRoute = inject(ActivatedRoute);

  public ERouters = ERouters;
  public icons = inject(IconsSanitizerService);

  public isMenuOpen = signal(false);

  public homeRouterLink = input<string[]>([]);

  public readonly hasIdCoursePurchase = signal(
    this.#activatedRoute.snapshot.paramMap.get('course_purchase_id'),
  );

  ngOnInit(): void {}

  public toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  public closeMenu() {
    this.isMenuOpen.set(false);
  }

  public onMenuContentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' || target.closest('a')) {
      this.closeMenu();
    } else {
      event.stopPropagation();
    }
  }
}
