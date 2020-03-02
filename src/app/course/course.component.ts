import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { returnHttpObservabe } from '../common/util';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
    courseId: string;
    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;
    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        
        this.course$ = returnHttpObservabe(`http://localhost:9000/api/courses/${this.courseId}`);

        this.lessons$ = this.loadLessons();
    }

    ngAfterViewInit() {
        const initialLessonsList$ = this.loadLessons();
        const searchLessons$ = this.initializeSearchableInput();

        this.lessons$ = concat(initialLessonsList$, searchLessons$);
    }

    /**
     * Loads the initial list os lessons
     */
    loadLessons(filter: string = ''): Observable<Lesson[]> {
        return returnHttpObservabe(`http://localhost:9000/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${filter}`)
            .pipe(
                map(res => res['payload'])
            );
    }

    initializeSearchableInput(): Observable<Lesson[]> {
        return fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event['target'].value),
                debounceTime(400),
                distinctUntilChanged(),
                switchMap((searchText: string) => this.loadLessons(searchText))
            );
    }
}
