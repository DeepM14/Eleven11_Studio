import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHomeGalleryComponent } from './admin-home-gallery.component';

describe('AdminHomeGalleryComponent', () => {
  let component: AdminHomeGalleryComponent;
  let fixture: ComponentFixture<AdminHomeGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminHomeGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHomeGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
