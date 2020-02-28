import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, noop} from 'rxjs';
import {catchError, delayWhen, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { returnHttpObservabe } from '../common/util';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    ngOnInit() {
        const http$ = returnHttpObservabe('http://localhost:9000/api/courses');
    
        const courses$ = http$.pipe(
          map(courses => Object.values(courses['payload'])),
          shareReplay()
        );

        this.beginnerCourses$ = courses$.pipe(
            map((courses: Course[]) => courses.filter((course: Course) => course.category == CourseCategoryEnum.BEGINNER))
        );

        this.advancedCourses$ = courses$.pipe(
            map((courses: Course[]) => courses.filter((course: Course) => course.category == CourseCategoryEnum.ADVANCED))
        );
    }
}

enum CourseCategoryEnum {
    BEGINNER = 'BEGINNER',
    ADVANCED = 'ADVANCED'
}
