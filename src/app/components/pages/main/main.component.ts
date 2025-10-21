import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription, timer} from "rxjs";

interface AccordionItem {
  title: string;
  content: string;
  isOpen: boolean;
  id: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit, OnDestroy {
  showPopup = false;
  // для хранения подписки
  private popupSubscription: Subscription | null = null;

  constructor() {
  }

  slides = [
    {
      img: "assets/images/chay-s-apelsinom1.png",
      alt: "baner1",
      class: "wow animate__backInLeft"
    },
    {
      img: "assets/images/tea2.png",
      alt: "baner2",
      class: ""
    },
    {
      img: "assets/images/tea3.png",
      alt: "baner3",
      class: ""
    }
  ];

  currentSlide = 0;
  private intervalId: any;

  // аккардеон
  accordionItems: AccordionItem[] = [
    {
      title: 'Собираете ли вы подарочные боксы?',
      content: 'Да, у нас есть такая услуга. Мы можем собрать подарочный бокс на любой вкус, объем и стоимость!',
      isOpen: false,
      id: '1'
    },
    {
      title: 'Сколько у вас разновидностей чая?',
      content: 'Ассортимент большой.',
      isOpen: false,
      id: '2'
    },
    {
      title: 'В какой срок осуществляется доставка?',
      content: 'Зависит от удаленности.',
      isOpen: false,
      id: '3'
    },
    {
      title: 'У вас обновляется ассортимент?',
      content: 'Да, каждый месяц.',
      isOpen: false,
      id: '4'
    },
    {
      title: 'Какого объема у вас пачки чая?',
      content: '200гр и более.',
      isOpen: false,
      id: '5'
    }
  ];

  ngOnInit() {
    this.startAutoSlide();
    this.setupPopupTimer();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.clearPopupTimer();
  }

  //  Observable Таймер для попапа
  private setupPopupTimer(): void {
    const popupObservable = new Observable<boolean>((observer) => {
      const timeoutId = setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 10000);

      return {
        unsubscribe() {
          clearTimeout(timeoutId);
          console.log('Всплывающий таймер отписан — пользователь покинул страницу');
        }
      };
    });

    this.popupSubscription = popupObservable.subscribe({
      next: (shouldShowPopup) => {
        if (shouldShowPopup) {
          this.showPopup = true;
          console.log('Всплывающее окно отображается через 10 секунд');
        }
      },
      error: (err) => {
        console.error('Ошибка во всплывающем таймере:', err);
      },
      complete: () => {
        console.log('Всплывающий таймер завершен');
      }
    });
  }

  // Очистка таймера
  private clearPopupTimer(): void {
    if (this.popupSubscription) {
      this.popupSubscription.unsubscribe();
      this.popupSubscription = null;
    }
  }

  // Обработчик закрытия попапа
  onPopupClosed(): void {
    this.showPopup = false;
    // очистить таймер если попап закрыли вручную
    this.clearPopupTimer();
  }

  // Кнопки для слайдера
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  // маркеры навигации
  // goToSlide(index: number) {
  //   this.currentSlide = index;
  //   this.restartAutoSlide();
  // }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // restartAutoSlide() {
  //   this.stopAutoSlide();
  //   this.startAutoSlide();
  // }


//  для аккордеона
  toggleItem(index: number): void {
    this.accordionItems[index].isOpen = !this.accordionItems[index].isOpen;
  }

}
