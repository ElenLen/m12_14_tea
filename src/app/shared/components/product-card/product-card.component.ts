import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CartProductService} from "../../services/cart-product.server";
import {ProductType} from "../../../../types/product.type";

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
