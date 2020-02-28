import { Component, OnInit } from '@angular/core';
import { interval, timer, fromEvent, Subscription, Observable, noop, of, concat } from 'rxjs';
import { returnHttpObservabe } from '../common/util';
import { map } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const source1$ = of(1, 2, 3);
    const source2$ = of(4, 5, 6);

    const result$ = concat(source1$, source2$);

    result$.subscribe(response => {
      console.log(response);
    });
  }
}
