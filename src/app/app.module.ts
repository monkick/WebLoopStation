import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MainComponent } from './main/main.component';
import {RecordingService} from "./service/recording.service";
import {UsermediaService} from "./service/usermedia.service";
import {PlayService} from "./service/play.service";
import {MicService} from "./service/mic.service";
import {SoundService} from "./service/sound.service";
import {AnalyzeService} from "./service/analyze.service";
import {DestinationService} from "./service/destination.service";
import {GainService} from "./service/gain.service";

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    RecordingService,
    UsermediaService,
    PlayService,
    MicService,
    SoundService,
    AnalyzeService,
      DestinationService,
      GainService
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
