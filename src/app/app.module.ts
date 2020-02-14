import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SafeHtmlPipe } from "./shared/pipes/safeHtml";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ColorSketchModule } from "ngx-color/sketch";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    ColorSketchModule,
    NgbModule
  ],
  declarations: [AppComponent, SafeHtmlPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
