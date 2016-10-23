import { Component, Output, EventEmitter } from "@angular/core";
import { Modal, ModalController, ViewController, NavParams } from "ionic-angular";
import Moment from "moment";
import { DateItem } from "./date-picker.interface";

/*
  Generated class for the DatePicker component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: "date-picker",
  template: `<div class="layout-col horizontal-center" style="background-color:white;height:100%">
  <div class="layout-col horizontal-center top-banner">
    <div class="dayofweek padding-5">{{currentMoment.format('dddd')}}</div>
    <div class="text-center padding-10">
      <div class="padding-5">
        <ion-icon class="arrow" name="arrow-back" (click)="setMonthBack()"></ion-icon>
        <span class="month padding-10">{{currentMoment.format('MMM')}}</span>
        <ion-icon class="arrow" name="arrow-forward" (click)="setMonthForward()"></ion-icon>
      </div>
      <div class="day padding-5">{{currentMoment.format('D')}}</div>
      <div class="text-center padding-5">
        <ion-icon class="arrow" name="arrow-back" (click)="setYearBack()"></ion-icon>
        <span class="year padding-10">{{currentMoment.format('YYYY')}}</span>
        <ion-icon class="arrow" name="arrow-forward" (click)="setYearForward()"></ion-icon>
      </div>
    </div>
  </div>
  <span class="month-year">{{currentMoment.format('MMMM YYYY')}}</span>
  <div class="calendar-item-container">
    <div class="layout-row day-item-header" style="width:100%;flex-wrap:wrap;text-align:center">
    <div>S</div>
    <div>M</div>
    <div>T</div>
    <div>W</div>
    <div>T</div>
    <div>F</div>
    <div>S</div>
  </div>
  <div class="layout-row" style="width:100%;flex-wrap:wrap;text-align:center" *ngFor="let week of daysGroupedByWeek;">
    <div class="day-item" [ngClass]="{'selected': day.isSelected, 'disabled': !day.isEnabled}" *ngFor="let day of week;" (click)="selectDate(day)">{{day.momentDate.date()}}</div>
  </div>
  </div>
  <div class="layout-row" style="width:100%;justify-content:Flex-end;margin:10px;">
    <button ion-button style="color:grey" clear (click)="cancel()">Cancel</button>
    <button ion-button clear (click)="confirmDateSelection()">OK</button>
  </div>


</div>`
})
export class DatePicker {

  @Output()
  public onDateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  @Output()
  public onCancelled: EventEmitter<any> = new EventEmitter<any>();

  private currentMoment: Moment.Moment;
  private daysGroupedByWeek = [];
  private selectedDateItem: DateItem;
  private daysOfMonth: DateItem[];
  private calendarModal: Modal;

  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController) {
    this.currentMoment = Moment();
    this.renderCalender();
  }

  private renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(this.currentMoment.year(), this.currentMoment.month() + 1, this.currentMoment.date());
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);

    this.setTodayAsDefaultSelectedDate();
  }

  private generateDaysOfMonth(year: number, month: number, day: number) {
    let calendarMonth = Moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

    let startOfMonth = calendarMonth.clone().startOf("month").day("sunday");
    let endOfMonth = calendarMonth.clone().endOf("month").day("saturday");

    let totalDays = endOfMonth.diff(startOfMonth, "days") + 1;

    let calendarDays: DateItem[] = [];

    for (let i = 0; i < totalDays; i++) {
      let immunableStartOfMonth = startOfMonth.clone();

      let dateItem: DateItem = {
        isSelected: false,
        momentDate: immunableStartOfMonth.add(i, "day"),
        isEnabled: this.isBelongToThisMonth(immunableStartOfMonth, month)
      };

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

  }

  private setTodayAsDefaultSelectedDate() {
    let today = Moment().startOf("day");
    let foundDates = this.daysOfMonth
      .filter((item: DateItem) => today.isSame(item.momentDate.clone().startOf("day")));

    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = true;
    }

  }

  private isBelongToThisMonth(momentDate: Moment.Moment, month: number) {

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

  private confirmDateSelection() {
    this.viewCtrl.dismiss(this.selectedDateItem.momentDate.toDate());
  }

  private cancel() {
    this.viewCtrl.dismiss();
  }

  public showCalendar() {
    this.calendarModal = this.modalCtrl.create(DatePicker);
    this.calendarModal.onDidDismiss( ( data: any ) => {
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
