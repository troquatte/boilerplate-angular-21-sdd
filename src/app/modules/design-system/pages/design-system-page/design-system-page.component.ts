import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-design-system-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './design-system-page.component.html',
  styleUrl: './design-system-page.component.scss',
})
export class DesignSystemPageComponent {}
