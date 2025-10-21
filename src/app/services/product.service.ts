import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductType} from "../types/product.type";
import {Injectable} from "@angular/core";

@Injectable()
export class ProductService {
  private products: ProductService[] = [];

  constructor(private http: HttpClient) {
  }

  //    ф-ция возвращающая продукты чая
  getProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>('https://testologia.ru/tea');
  }

  // запрос одного товара чая
  getProduct(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(`https://testologia.ru/tea?id=${id}`);
  }

  //   для отправки заказа
  createOrder(data: {
    name: string,
    last_name: string,
    phone: number,
    country: string,
    zip: number,
    product: string,
    address: string,
    comment?: string
  }) {
    return this.http.post<{
      success: boolean,
      message?: string
    }>(`https://testologia.ru/order-tea`, data);
  }

}
