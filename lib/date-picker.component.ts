import { Component, Output, EventEmitter, ViewEncapsulation, Input } from "@angular/core";
import { Modal, ModalController, ViewController, NavParams } from "ionic-angular";

import moment from 'moment/src/moment';

import { DateItem, DatePickerOption } from "./date-picker.interface";

/**
 * Generated class for the DatePickerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'date-picker',
  templateUrl: 'date-picker.html',
  styleUrls: ['date-picker.scss'],
})
export class DatePicker {

  @Output()
  public onDateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  @Output()
  public onCancelled: EventEmitter<any> = new EventEmitter<any>();

  private currentMoment: moment.Moment;
  private daysGroupedByWeek = [];
  private selectedDateItem: DateItem;
  private daysOfMonth: DateItem[];
  private calendarModal: Modal;
  private datePickerOption?: DatePickerOption;

  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController, params?: NavParams) {
    this.currentMoment = moment();


    this.datePickerOption = params && params.data ? params.data : this.datePickerOption;
    this.renderCalender();
  }

  private renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(this.currentMoment.year(), this.currentMoment.month() + 1, this.currentMoment.date());
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);

    this.setTodayAsDefaultSelectedDate();
  }

  private generateDaysOfMonth(year: number, month: number, day: number) {
    let calendarMonth = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

    let startOfMonth = calendarMonth.clone().startOf("month").day("sunday");
    let endOfMonth = calendarMonth.clone().endOf("month").day("saturday");

    let totalDays = endOfMonth.diff(startOfMonth, "days") + 1;

    let calendarDays: DateItem[] = [];

    for (let i = 0; i < totalDays; i++) {
      let immunableStartOfMonth = startOfMonth.clone();

      let dateItem: DateItem = {
        isSelected: false,
        momentDate: immunableStartOfMonth.add(i, "day"),
        isEnabled: true
      };

      dateItem.isEnabled = this.isBelongToThisMonth(immunableStartOfMonth, month) &&
        this.startingFrom(dateItem.momentDate) && this.endingAt(dateItem.momentDate);

      calendarDays.push(dateItem);
    }

    return calendarDays;
  }

  private groupByWeek(daysOfMonth: DateItem[]) {

    let groupedDaysOfMonth = new Array<DateItem[]>();

    daysOfMonth.forEach((item, index) => {


      let groupIndex = Math.floor((index / 7));

      groupedDaysOfMonth[groupIndex] = groupedDaysOfMonth[groupIndex] || [];

      groupedDaysOfMonth[groupIndex].push(item);


    });

    return groupedDaysOfMonth;

  }

  private selectDate(day: DateItem) {

    if (!day.isEnabled) return;

    if (this.selectedDateItem && this.selectedDateItem.isSelected) {
      this.selectedDateItem.isSelected = false;
    }

    day.isSelected = true;
    this.selectedDateItem = day;
    this.currentMoment = day.momentDate.clone();

  }

  private setTodayAsDefaultSelectedDate() {
    let today = moment().startOf("day");
    let foundDates = this.daysOfMonth
      .filter((item: DateItem) => today.isSame(item.momentDate.clone().startOf("day")));

    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = true;
    }

  }

  private isBelongToThisMonth(momentDate: moment.Moment, month: number) {

    return momentDate.month() + 1 === month;
  }

  private setMonthBack() {
    this.currentMoment.subtract(1, "month");
    this.renderCalender();

  }

  private setMonthForward() {
    this.currentMoment.add(1, "month");
    this.renderCalender();
  }

  private setYearBack() {
    this.currentMoment.subtract(1, "year");
    this.renderCalender();
  }
  private setYearForward() {
    this.currentMoment.add(1, "year");
    this.renderCalender();
  }

  private startingFrom(currentMomentDate: moment.Moment) {
    if (!this.datePickerOption || !this.datePickerOption.minimumDate) return true;
    let startOfMinimumDay = this.datePickerOption.minimumDate.setHours(0);

    return currentMomentDate.startOf('day')
      .isSameOrAfter(moment(startOfMinimumDay).startOf('day'));

  }

  private endingAt(endingMomentDate: moment.Moment){
    if (!this.datePickerOption || !this.datePickerOption.maximumDate) return true;
    let startOfMaximumDay = this.datePickerOption.maximumDate.setHours(0);

    return endingMomentDate.startOf('day')
      .isSameOrBefore(moment(startOfMaximumDay).startOf('day'));
  }

  private confirmDateSelection() {
    this.viewCtrl.dismiss(this.selectedDateItem.momentDate.toDate());
  }

  private cancel() {
    this.viewCtrl.dismiss();
  }

  public showCalendar(datePickerOption?: DatePickerOption) {
    this.calendarModal = this.modalCtrl.create(DatePicker, datePickerOption);

    this.calendarModal.onDidDismiss((data: any) => {
      if (data) {
        this.onDateSelected.emit(data);
      }
      else {
        this.onCancelled.emit();
      }
    });

    this.calendarModal.present();
  }


}
