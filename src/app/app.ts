import { Component, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Nav } from './nav/nav';

const EDGE_ZONE_PX = 24;
const SWIPE_THRESHOLD_PX = 70;
const MAX_VERTICAL_DRIFT_PX = 50;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  template: `
    @if (navigating()) {
      <div class="progress-bar"><span></span></div>
    }
    <app-nav />
    <main>
      <router-outlet />
    </main>
  `,
  styleUrl: './app.css',
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchmove)': 'onTouchMove($event)',
    '(touchend)': 'onTouchEnd()',
  },
})

export class App {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected readonly title = signal('scorekeeper-fe');
  protected readonly navigating = signal(false);

  private touchStartX = 0;
  private touchStartY = 0;
  private tracking = false;
  private triggered = false;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.navigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.navigating.set(false);
      }
    });
  }

  protected onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    this.tracking = touch.clientX <= EDGE_ZONE_PX;
    this.triggered = false;
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  protected onTouchMove(event: TouchEvent) {
    if (!this.tracking || this.triggered) {
      return;
    }

    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = Math.abs(touch.clientY - this.touchStartY);

    if (deltaX >= SWIPE_THRESHOLD_PX && deltaY <= MAX_VERTICAL_DRIFT_PX) {
      this.triggered = true;
      this.location.back();
    }
  }

  protected onTouchEnd() {
    this.tracking = false;
  }
}
