import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { DatePicker } from './components/date-picker/date-picker';
import { IonicModule } from "ionic-angular";
import {  DatePickerProvider } from './providers/date-picker/date-picker';
@NgModule({
	declarations: [DatePicker],
	imports: [
		IonicModule.forRoot(DatePicker)
	],
	providers:[
		DatePickerProvider
	],
	exports: [DatePicker],
	entryComponents:[
		DatePicker
	]
})
export class DatePickerModule {}
