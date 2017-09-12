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
