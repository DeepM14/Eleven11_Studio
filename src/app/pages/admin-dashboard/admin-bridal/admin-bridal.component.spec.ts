import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBridalComponent } from './admin-bridal.component';

describe('AdminBridalComponent', () => {
  let component: AdminBridalComponent;
  let fixture: ComponentFixture<AdminBridalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminBridalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBridalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
