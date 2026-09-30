import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaxiRides } from './taxi-rides/taxi-rides';

@Component({
  imports: [RouterOutlet, TaxiRides],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Frontend');
}
