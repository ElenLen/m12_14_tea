import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {tap} from "rxjs";
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private productService: ProductService,
              private http: HttpClient,
              private router: Router) {
  }

  // шаблон для продуктов
  products: ProductType[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    // когда отправили запрос
    this.loading = true;

    //   указываем адрес откуда будем забирать данные с бэка
    this.productService.getProducts()
      .pipe(
        tap(() => {
          // когда получили ответ
          this.loading = false;
        })
      )
      //   подписываемся на изменения обзервл
      .subscribe(
        // для обработки ошибок
        {
          next: (data) => {
            this.products = data;
          },
          error: (error) => {
            // выводим ошибку и возвращаем на гл стр
            console.log(error);
            this.router.navigate(['/']);
          }
        });
  }

}
