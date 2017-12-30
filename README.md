# Ionic 2 Date Picker

## Description
This is a component that shows a date picker to select a date.

## Preview
![preview](https://github.com/shangyilim/ionic2-date-picker/blob/master/date-picker.PNG?raw=true)
## Getting Started
Install using npm

`$ npm install ionic2-date-picker --save`

Add the component in the `app.module.ts`
```typescript
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { DatePicker } from 'ionic2-date-picker';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DatePicker
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DatePicker
  ],
  providers: []
})
export class AppModule {}
```

Import the module in the page that requires the date picker:
```html
<ion-content padding>
  The world is your oyster.
  <p>
    If you get lost, the <a href="http://ionicframework.com/docs/v2">docs</a> will be your guide.
  </p>
  <button (click)="showCalendar()">Show Calendar</button>
</ion-content>
```

Instantiate an instance of the `DatePicker` 
```typescript
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { DatePicker } from 'ionic2-date-picker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ DatePicker ]
})
export class HomePage {

  constructor(public navCtrl: NavController, public datePicker: DatePicker) {
    
    this.datePicker = new DatePicker(<any>this.modalCtrl, <any>this.viewController);
    this.datePicker.onDateSelected.subscribe((date) => { console.log(date); });
  }

  showCalendar() {
    this.datePicker.showCalendar();
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

 this.datePicker.showCalendar(datePickerOption);

```
### Options
| Property      | Type | Description  |
| ------------- |------| -------------|
| minimumDate   | Date | the minimum selectable date |
| maximumDate   | Date | the maximum selectable date |

## Contributing
Freely fork and submit a pull request describing what was fixed/added and link it to an issue ;)

