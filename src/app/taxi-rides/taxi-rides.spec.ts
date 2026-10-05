import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxiRides } from './taxi-rides';

describe('TaxiRides', () => {
  let component: TaxiRides;
  let fixture: ComponentFixture<TaxiRides>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiRides],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxiRides);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
