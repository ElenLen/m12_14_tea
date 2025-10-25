import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductCardComponent} from "./components/product-card/product-card.component";
import {PopupComponent} from "./components/popup/popup.component";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    PopupComponent,
    ProductCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    PopupComponent,
    ProductCardComponent,
  ]
})
export class SharedModule { }
