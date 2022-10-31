import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YahooProjectPageComponent } from './yahoo-project-page.component';

describe('YahooProjectPageComponent', () => {
  let component: YahooProjectPageComponent;
  let fixture: ComponentFixture<YahooProjectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YahooProjectPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YahooProjectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
