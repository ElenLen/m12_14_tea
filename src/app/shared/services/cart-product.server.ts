import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartProductService {
  count: number = 0;
  constructor() { }

}
