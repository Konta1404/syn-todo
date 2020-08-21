import { Injectable } from '@angular/core';
import { MatDrawer } from "@angular/material/sidenav";

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private drawer: MatDrawer;

  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }

  toggle(): void {
    this.drawer.toggle();
  }

}
