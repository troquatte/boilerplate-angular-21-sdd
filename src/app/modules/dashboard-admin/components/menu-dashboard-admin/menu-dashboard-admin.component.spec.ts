import { ComponentFixture, TestBed } from '@angular/core/testing';

import MenuDashboardAdminComponent from './menu-dashboard-admin.component';

describe('MenuDashboardAdminComponent', () => {
  let component: MenuDashboardAdminComponent;
  let fixture: ComponentFixture<MenuDashboardAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDashboardAdminComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuDashboardAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
