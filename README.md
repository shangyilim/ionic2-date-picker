# Ionic 2 Date Picker

## Description
This is a component that shows a date picker to select a date.

## AOT
Ionic 2 Date Picker is now AOT Compatibile starting from version 1.1.0. Unfortunately this is a breaking change on previous versions of the DatePicker. The example usage can be in the Getting Started guide. 

## Preview
![preview](https://github.com/shangyilim/ionic2-date-picker/blob/master/date-picker.PNG?raw=true)
## Getting Started
Install using npm

`$ npm install ionic2-date-picker --save`

Add the module `DatePickerModule` in the `app.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { DatePickerModule } from 'ionic2-date-picker';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    DatePickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
  ]
})
export class AppModule {}
```

Import the `DatePickerProvider` in the page that requires the date picker:
```html
<ion-content padding>
  The world is your oyster.
  <p>
    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will be your guide.
  </p>
  <button (click)="showCalendar()">Show Calendar</button>
</ion-content>
```

Inject the `DatePickerProvider` and  `ModalController` 
```typescript
import { Component } from '@angular/core';

import { ModalController } from 'ionic-angular';

import { DatePickerProvider } from 'ionic2-date-picker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private datePickerProvider: DatePickerProvider ) {
    
  }

  showCalendar() {
    const dateSelected = 
      this.datePickerProvider.showCalendar(this.modalCtrl);

    dateSelected.subscribe(date => 
      console.log("first date picker: date selected is", date));
  }

  showCalendar2() {
    const dateSelected = 
      this.datePickerProvider.showCalendar(this.modalCtrl);

    dateSelected.subscribe(date => 
      console.log("second date picker: date selected is", date));
  }

}

```

## Date Picker Options
The date picker comes with optional configuration options that can be used on the `datePicker.showCalendar()`.
If you need more options, feel free to leave an issue or submit a pull request ;)

Import the DatePickerOption from the package.
```
import { DatePickerOption } from 'ionic2-date-picker';
```

create the datePickerOption and pass it as an argument to the `showCalendar()` function:
```
let datePickerOption: DatePickerOption = {
      minimumDate: new Date() // the minimum date selectable
      maximumDate: new Date() // the maximum date selectable
}; 
this.datePickerProvider.showCalendar(this.modalCtrl, datePickerOption);

```
### Options
| Property      | Type | Description  |
| ------------- |------| -------------|
| minimumDate   | Date | the minimum selectable date |
| maximumDate   | Date | the maximum selectable date |

## Contributing
Freely fork and submit a pull request describing what was fixed/added and link it to an issue ;)

