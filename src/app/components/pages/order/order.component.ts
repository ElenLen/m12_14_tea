import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit, OnDestroy {
  //  Форма
  orderForm: FormGroup = this.fb.group({
    product: [{value: '', disabled: true}, Validators.required],
    name: ['', [
      Validators.required,
      Validators.pattern(/^[А-Яа-яЁёA-Za-z]+$/)
    ]],
    last_name: ['', [
      Validators.required,
      Validators.pattern(/^[А-Яа-яЁёA-Za-z]+$/)
    ]],
    phone: ['', [
      Validators.required,
      this.phoneValidator
    ]],
    country: ['', Validators.required],
    zip: ['', Validators.required],
    address: ['', [
      Validators.required,
      Validators.pattern(/^[А-Яа-яЁёA-Za-z0-9\s\-\/]+$/)
    ]],
    comment: ['']
  });

  // Состояния формы
  isSubmitted = false;
  isSuccess = false;
  isError = false;
  isLoading = false;

  // для хранения подписки
  private subscription: Subscription | null = null;
  private subscriptionOrder: Subscription | null = null;

  constructor(private activatedRoute: ActivatedRoute,
              private productService: ProductService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // Подписываемся на query параметры
    this.subscription = this.activatedRoute.queryParams.subscribe(params => {
      if (params['product']) {
        this.orderForm.patchValue({
          product: params['product']
        });
      }
    });

    // Отслеживание изменений формы (опционально)
    this.orderForm.valueChanges.subscribe(values => {
      console.log('Значения формы изменены:', values);
    });
  }

  // Кастомный валидатор для телефона
  private phoneValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    // Убираем все кроме цифр и плюса
    const digitsOnly = value.replace(/[^\d+]/g, '');
    const digitCount = digitsOnly.replace('+', '').length;

    // Проверяем формат
    if (!/^\+?\d+$/.test(digitsOnly)) {
      return {invalidPhone: true};
    }

    // Проверяем количество цифр (должно быть 11)
    if (digitCount !== 11) {
      return {phoneLength: true};
    }
    return null;
  }

  // для удобства доступа к полям формы
  get product() {
    return this.orderForm.get('product');
  }

  get name() {
    return this.orderForm.get('name');
  }

  get last_name() {
    return this.orderForm.get('last_name');
  }

  get phone() {
    return this.orderForm.get('phone');
  }

  get country() {
    return this.orderForm.get('country');
  }

  get zip() {
    return this.orderForm.get('zip');
  }

  get address() {
    return this.orderForm.get('address');
  }

  get comment() {
    return this.orderForm.get('comment');
  }

//   Валидация
  createOrder() {
    this.isSubmitted = true;
    this.isError = false;

    // Проверяем валидность формы
    if (this.orderForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    // Устанавливаем состояние загрузки
    this.isLoading = true;

    // Подготавливаем данные для отправки
    const formData = {
      name: this.name?.value,
      last_name: this.last_name?.value,
      phone: this.phone?.value.toString(),
      country: this.country?.value,
      zip: this.zip?.value.toString(),
      product: this.product?.value,
      address: this.address?.value,
      comment: this.comment?.value || ''
    };

    // отправка заказа, чистим поля после отправки
    this.subscriptionOrder = this.productService.createOrder(formData)
      .subscribe({
        next: (response) => {
          // Сбрасываем состояние загрузки
          this.isLoading = false;

          if (response.success && !response.message) {
            this.isSuccess = true;
            this.orderForm.reset();
          } else {
            this.isError = true;
          }
        },
        error: (error) => {
          // Сбрасываем состояние загрузки при ошибке
          this.isLoading = false;

          console.error('Ошибка создания заказа:', error);
          this.isError = true;
        }
      });
  }

// Помечаем все поля как touched для показа ошибок
  private markAllFieldsAsTouched(): void {
    Object.keys(this.orderForm.controls).forEach(key => {
      const control = this.orderForm.get(key);
      control?.markAsTouched();
    });
  }

  // Сброс состояния формы
  resetForm(): void {
    this.isSubmitted = false;
    this.isSuccess = false;
    this.isError = false;
    this.isLoading = false;
    this.orderForm.reset();
  }

  // валидац сообщения
  getValidationMessage(controlName: string): string {
    const control = this.orderForm.get(controlName);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'Это поле обязательно для заполнения';
    }

    if (errors['pattern']) {
      switch (controlName) {
        case 'name':
        case 'last_name':
          return 'Можно вводить только буквы';
        case 'address':
          return 'Можно вводить только буквы, цифры, пробелы, дефис и слеш';
        default:
          return 'Неверный формат';
      }
    }

    if (errors['invalidPhone']) {
      return 'Телефон может содержать только цифры и знак +';
    }

    if (errors['phoneLength']) {
      return 'Телефон должен содержать 11 цифр';
    }

    return 'Неверное значение';
  }

  //   для отписки
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscriptionOrder?.unsubscribe();
  }

}
