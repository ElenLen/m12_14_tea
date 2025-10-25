import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductType} from "../../../types/product.type";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: ProductService[] = [];

  constructor(private http: HttpClient) {
  }

  //    ф-ция возвращающая продукты чая
  getProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(environment.apiURL + 'tea');
  }

  // запрос одного товара чая
  getProduct(id: number): Observable<ProductType> {
    return this.http.get<ProductType>(environment.apiURL + `tea?id=${id}`);
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
    }>(environment.apiURL + `order-tea`, data);
  }

}
