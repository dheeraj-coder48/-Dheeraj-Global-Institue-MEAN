import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Notice } from './notice/notice';
import { Events } from './events/events';
import { Achievements } from './achievements/achievements';
import { Gallery } from './gallery/gallery';

@Component({
  selector: 'app-home',
  imports: [Hero, Notice, Events, Achievements, Gallery],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
