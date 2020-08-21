import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from "@angular/material/button";
import { WeatherCardComponent } from "../../components/weather-card/weather-card.component";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { HttpClientModule } from '@angular/common/http';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDividerModule} from "@angular/material/divider";
import {MatListModule} from "@angular/material/list";

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    HttpClientModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule
  ],
  declarations: [HomeComponent, WeatherCardComponent],
  exports: []
})

export class HomeModule { }
