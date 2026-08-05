import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './nav/nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  template: `
    <app-nav />
    <main>
      <router-outlet />
    </main>
  `,
  styleUrl: './app.css',
})

export class App {
  protected readonly title = signal('scorekeeper-fe');
}
