import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProductType} from "../../../types/product.type";
import {CartProductService} from "../../../services/cart-product.server";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  providers: [CartProductService]
})

export class ProductCardComponent {
  // от родительского к дочернему
  @Input() product: ProductType;
  // декоратор, от дочернего к родительскому
  @Output() addToCartEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(public cartProductService: CartProductService) {
    this.product = {
      id: 0,
      image: '',
      title: '',
      price: 0,
      description: '',
    }
  }

}
