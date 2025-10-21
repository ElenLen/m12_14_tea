import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  isVisible = true;

  @Output() closed = new EventEmitter<void>();

  constructor(private router: Router) {
  }

  close(): void {
    this.isVisible = false;
    this.closed.emit();
  }

  goToCatalog(): void {
    this.close();
    this.router.navigate(['/products']);
  }

}
