import { ComponentFixture, TestBed } from '@angular/core/testing';

import MenuBottomContainerComponent from './menu-bottom-container.component';

describe('MenuBottomContainerComponent', () => {
  let component: MenuBottomContainerComponent;
  let fixture: ComponentFixture<MenuBottomContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuBottomContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuBottomContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
