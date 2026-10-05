import { Component, signal } from '@angular/core';
import { TaxiRides } from './taxi-rides/taxi-rides';

@Component({
  imports: [TaxiRides],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Frontend');
}
