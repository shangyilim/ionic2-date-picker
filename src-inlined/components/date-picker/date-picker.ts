import { Component, Output, EventEmitter, ViewEncapsulation, Input, OnDestroy } from "@angular/core";
import { Modal, ModalController, ViewController, NavParams } from "ionic-angular";
import * as moment from 'moment';

import { DateItem, DatePickerOption } from "../../date-picker.interface";
import { DatePickerProvider } from '../../providers/date-picker/date-picker';

@Component({
  selector: 'date-picker',
  template: `
    <div class="date-picker">
      <div class="layout-col horizontal-center layout-background">
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
        <div class="month-year">{{currentMoment.format('MMMM YYYY')}}</div>
        <div class="calendar-item-container">
          <div class="layout-row day-item-header">
            <div class="day-item-header-item">S</div>
            <div class="day-item-header-item">M</div>
            <div class="day-item-header-item">T</div>
            <div class="day-item-header-item">W</div>
            <div class="day-item-header-item">T</div>
            <div class="day-item-header-item">F</div>
            <div class="day-item-header-item">S</div>
          </div>
          <div class="layout-row day-container" *ngFor="let week of daysGroupedByWeek;">
            <div class="day-item" [ngClass]="{'day-selected': day.isSelected, 'day-disabled': !day.isEnabled}" *ngFor="let day of week;" (click)="selectDate(day)">{{day.momentDate.date()}}</div>
          </div>
        </div>
        <div class="layout-row action-container">
          <button class="cancel-button button button-md button-clear button-clear-md" clear (click)="cancel()">Cancel</button>
          <button clear class="ok-button button button-md button-clear button-clear-md" (click)="confirmDateSelection()">OK</button>
        </div>


      </div>
    </div>
  `,
  styles: [`
    .date-picker .layout-row{display:flex;flex-direction:row}.date-picker .layout-col{display:flex;flex-direction:column}.date-picker .horizontal-center{align-items:center}.date-picker .text-center{text-align:center}.date-picker .layout-background{background-color:white;height:100%}.date-picker .padding-5{padding:5px}.date-picker .padding-10{padding:10px}.date-picker .arrow{margin-left:10px;margin-right:10px}.date-picker .day-item-header{width:100%;flex-wrap:wrap;text-align:center}.date-picker .day-item-header-item{padding:10px;flex:1;font-weight:bold}.date-picker .day-container{width:100%;flex-wrap:wrap;text-align:center}.date-picker .day-item{flex:1;line-height:36px;min-height:36px}.date-picker .day-selected{background-color:#e0edff}.date-picker .day-disabled{color:#cfcfcf}.date-picker .dayofweek{font-size:1.5em}.date-picker .day{font-size:3em}.date-picker .month{font-size:1.5em}.date-picker .year{font-size:1.5em}.date-picker .month-year{font-size:1.3em;padding:10px}.date-picker .top-banner{background-color:#1e90ff;color:white;width:100%;padding:10px;min-height:200px}.date-picker .calendar-item-container{width:100%;padding:5px;min-height:262px}.date-picker .action-container{width:100%;justify-content:Flex-end;margin:10px}.date-picker .cancel-button{color:grey}
  `],
})
export class DatePicker implements OnDestroy {

  @Output() public onDateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  @Output() public onCancelled: EventEmitter<any> = new EventEmitter<any>();

  public currentMoment: moment.Moment;
  public daysGroupedByWeek = [];

  private selectedDateItem: DateItem;
  private daysOfMonth: DateItem[];
  private calendarModal: Modal;
  private datePickerOption?: DatePickerOption;

  constructor(private datePickerProvider: DatePickerProvider) {
    this.currentMoment = moment();
    this.renderCalender();
  }

  ngOnDestroy() {
    this.datePickerProvider.onUnsubscribe.next();
    this.datePickerProvider.onUnsubscribe.complete();
  }

  public setMonthBack() {
    this.currentMoment.subtract(1, "month");
    this.renderCalender();

  }

  public setMonthForward() {
    this.currentMoment.add(1, "month");
    this.renderCalender();
  }

  public setYearBack() {
    this.currentMoment.subtract(1, "year");
    this.renderCalender();
  }
  public setYearForward() {
    this.currentMoment.add(1, "year");
    this.renderCalender();
  }

  public cancel() {
    this.datePickerProvider.onDismiss.next('dismiss');
    this.datePickerProvider.onDismiss.complete();
  }

  public confirmDateSelection() {
    this.datePickerProvider.onDismiss.next(this.selectedDateItem.momentDate.toDate());
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



  private startingFrom(currentMomentDate: moment.Moment) {
    if (!this.datePickerOption || !this.datePickerOption.minimumDate) return true;
    let startOfMinimumDay = this.datePickerOption.minimumDate.setHours(0);

    return currentMomentDate.startOf('day')
      .isSameOrAfter(moment(startOfMinimumDay).startOf('day'));

  }

  private endingAt(endingMomentDate: moment.Moment) {
    if (!this.datePickerOption || !this.datePickerOption.maximumDate) return true;
    let startOfMaximumDay = this.datePickerOption.maximumDate.setHours(0);

    return endingMomentDate.startOf('day')
      .isSameOrBefore(moment(startOfMaximumDay).startOf('day'));
  }

}
