import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YahooResultDisplayComponent } from './yahoo-result-display.component';

describe('YahooResultDisplayComponent', () => {
  let component: YahooResultDisplayComponent;
  let fixture: ComponentFixture<YahooResultDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YahooResultDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YahooResultDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
