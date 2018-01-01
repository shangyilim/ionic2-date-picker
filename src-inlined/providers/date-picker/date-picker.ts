import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController, Modal } from "ionic-angular";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { DatePicker } from '../../components';

import { DatePickerOption } from '../../date-picker.interface';

/*
  Generated class for the DatePickerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatePickerProvider {


  onUnsubscribe: Subject<any>;
  onDismiss: Subject<any>;
  onDateSelected: Subject<Date>;

  constructor() {
  }

  showCalendar(modalCtrl: ModalController | any , datePickerOption?: DatePickerOption): Observable<Date> {

    this.onDateSelected = new Subject();
    this.onDismiss = new Subject();
    this.onUnsubscribe = new Subject();

    const calendarModal = modalCtrl.create(DatePicker, datePickerOption);

    calendarModal.present();

    this.onDismiss
      .takeUntil(this.onUnsubscribe)
      .subscribe((result) => this.handleCalendarDismissed(result, calendarModal));

      return this.onDateSelected.asObservable();
  }

  handleCalendarDismissed(result, calendarModal: Modal) {
    if (result === 'dismiss') {
      calendarModal.dismiss();
    }
    else if (result instanceof Date) {
      this.onDateSelected.next(result);
      calendarModal.dismiss();
    }
  }

}
