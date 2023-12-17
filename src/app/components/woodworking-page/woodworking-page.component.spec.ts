import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WoodworkingPageComponent } from './woodworking-page.component';

describe('WoodworkingPageComponent', () => {
  let component: WoodworkingPageComponent;
  let fixture: ComponentFixture<WoodworkingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WoodworkingPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WoodworkingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
