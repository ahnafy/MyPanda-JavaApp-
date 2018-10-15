import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Summary} from './summary';
import {SummaryListComponent} from "./summary-list.component";
import {SummaryListService} from "./summary-list.service";
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";
import {ArraySortPipe} from "../journals/array-sort.pipe";


/** Tests the filtering used for display of summary list ---------------------------------------------------------------------------------- **/

        describe('Summary', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            userID: 'userID1',
                            emotion: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            userID: 'userID1',
                            emotion: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            userID: 'userID1',
                            emotion: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


                TestBed.configureTestingModule({
                    imports: [CustomModule, RouterTestingModule],
                    declarations: [SummaryListComponent, ArraySortPipe],
                    providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
                });
            });

            beforeEach(async(() => {
                TestBed.compileComponents().then(() => {
                    fixture = TestBed.createComponent(SummaryListComponent);
                    summary = fixture.componentInstance;
                    fixture.detectChanges();

                    summary.summaryEmotion = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                });
            }));

            it('contains all the summaries', () => {
        expect(summary.summaries.length).toBe(3);
            });

            it('contains a summary emotion \'happy\'', () => {
        expect(summary.summaries.some((summary: Summary) => summary.emotion === 'happy')).toBe(true);
            });

            it('contain a summary id \'2\'', () => {
        expect(summary.summaries.some((summary: Summary) => summary._id === '2')).toBe(true);
            });

            it('doesn\'t contain a summary id \'4\'', () => {
        expect(summary.summaries.some((summary: Summary) => summary._id === '4')).toBe(false);
            });

            it('summary filters by emotion', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.summaryEmotion = 'sad';
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('summary filters by intensity', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.summaryIntensity = '4';
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('summary filters by emotion and intensity', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.summaryEmotion = 'sad';
                summary.summaryIntensity = '4';
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('summary filters by start date', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.startDate = new Date('Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)');
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(2);
                });
            });

            it('summary filters by end date', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.endDate = new Date('Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)');
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('summary filters by emotion, intensity, start and end date', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.summaryEmotion = 'happy';
                summary.summaryIntensity = '2';
                summary.startDate = new Date('Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)');
                summary.endDate = new Date('Sat Apr 07 2018 20:00:00 GMT-0000 (UTC)');
                summary.refreshSummaries().subscribe(() => {
                    expect(summary.filteredSummaries.length).toBe(1);
                });
            });

            it('clearDateFilter() works', () => {
                expect(summary.filteredSummaries.length).toBe(3);
                summary.startDate = 'Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)';
                summary.endDate = 'Sat Apr 07 2018 20:00:00 GMT-0000 (UTC)';
                expect(summary.startDate).toBe('Fri Apr 06 2018 15:23:28 GMT-0000 (UTC)');
                expect(summary.endDate).toBe('Sat Apr 07 2018 20:00:00 GMT-0000 (UTC)');
                summary.clearDateFilter();
                expect(summary.startDate).toBe(null);
                expect(summary.endDate).toBe(null);

            });

        });

        /** Tests the filtering used for charts when looking at all time ---------------------------------------------------------------------------------- **/

        describe('Chart Filtering - no limit', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            userID: 'userID1',
                            emotion: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            userID: 'userID1',
                            emotion: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            userID: 'userID1',
                            emotion: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


                TestBed.configureTestingModule({
                    imports: [CustomModule, RouterTestingModule],
                    declarations: [SummaryListComponent, ArraySortPipe],
                    providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
                });
            });

            beforeEach(async(() => {
                TestBed.compileComponents().then(() => {
                    fixture = TestBed.createComponent(SummaryListComponent);
                    summary = fixture.componentInstance;
                    fixture.detectChanges();

                    summary.summaryEmotion = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                    summary.limitedPast = false;
                });
            }));

            it('filterGraph filters correctly for all time', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterGraph(0, 'mad')).toBe(1);
                expect(summary.filterGraph(2, 'mad')).toBe(0);
            });

        });

        /** Tests the filtering used for charts when looking at past day ---------------------------------------------------------------------------------- **/

        describe('Chart Filtering - Past Day', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            userID: 'userID1',
                            emotion: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            userID: 'userID1',
                            emotion: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            userID: 'userID1',
                            emotion: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


                TestBed.configureTestingModule({
                    imports: [CustomModule, RouterTestingModule],
                    declarations: [SummaryListComponent, ArraySortPipe],
                    providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
                });
            });

            beforeEach(async(() => {
                TestBed.compileComponents().then(() => {
                    fixture = TestBed.createComponent(SummaryListComponent);
                    summary = fixture.componentInstance;
                    fixture.detectChanges();

                    summary.summaryEmotion = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                    summary.limitedPast = true;
                    summary.nowStamp = new Date('Sun Apr 08 2018 20:00:00 GMT-0000 (UTC)');
                    // Above means nowHour becomes 20
                    summary.nowHour = 20;
                    summary.lastDayStamp = new Date('Sat Apr 07 2018 20:00:00 GMT-0000 (UTC)');
                    summary.inputType = "day";
                });
            }));

            it('filterGraph filters correctly for inputType = day', () => {
                expect(summary.summaries.length).toBe(3);
                console.log(summary.nowStamp.toString());
                console.log(summary.nowHour.toString());
                expect(summary.filterGraph(15, 'mad')).toBe(1);
                expect(summary.filterGraph(2, 'mad')).toBe(0);
            });

            it('modHour works as intended', () => {
                expect(summary.modHour(23)).toBe(20);
                expect(summary.modHour(0)).toBe(21);
                expect(summary.modHour(30)).toBe(3);
                summary.limitedPast = false;
                expect(summary.modHour(23)).toBe(4);
                expect(summary.modHour(0)).toBe(5);
                expect(summary.modHour(30)).toBe(11);
            });

            it('filterGraph works correctly when using modHour', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterGraph(summary.modHour(18), 'mad')).toBe(1);
                expect(summary.filterGraph(summary.modHour(0), 'mad')).toBe(0);
            });

            it('getPastHours works as intended', () => {
                expect(summary.getPastHours(1)).toBe('5 PM');
                expect(summary.getPastHours(13)).toBe('5 AM');
                expect(summary.getPastHours(0)).toBe('4 PM');
                expect(summary.getPastHours(12)).toBe('4 AM');
                expect(summary.getPastHours(8)).toBe('12 AM');
            });

        });

        /** Tests the filtering used for charts when looking at past week ---------------------------------------------------------------------------------- **/

        describe('Chart Filtering - Past Week', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            userID: 'userID1',
                            emotion: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            userID: 'userID1',
                            emotion: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            userID: 'userID1',
                            emotion: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


                TestBed.configureTestingModule({
                    imports: [CustomModule, RouterTestingModule],
                    declarations: [SummaryListComponent, ArraySortPipe],
                    providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
                });
            });

            beforeEach(async(() => {
                TestBed.compileComponents().then(() => {
                    fixture = TestBed.createComponent(SummaryListComponent);
                    summary = fixture.componentInstance;
                    fixture.detectChanges();

                    summary.summaryEmotion = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                    summary.limitedPast = true;
                    summary.nowStamp = new Date('Sun Apr 08 2018 20:00:00 GMT-0000 (UTC)');
                    // Above means nowDay becomes 0
                    summary.nowDay = 0;
                    summary.lastWeekStamp = new Date('Sun Apr 01 2018 20:00:00 GMT-0000 (UTC)');
                    summary.inputType = "week";
                });
            }));

            it('filterGraph filters correctly for inputType = week', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterGraph(4, 'sad')).toBe(1);
                expect(summary.filterGraph(2, 'sad')).toBe(0);
            });

            it('modDay works as intended', () => {
                expect(summary.modDay(6)).toBe(0);
                expect(summary.modDay(0)).toBe(1);
                expect(summary.modDay(30)).toBe(3);
                summary.limitedPast = false;
                expect(summary.modDay(5)).toBe(5);
            });

            it('filterGraph works correctly when using modDay', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterGraph(summary.modDay(10), 'sad')).toBe(1);
                expect(summary.filterGraph(summary.modDay(0), 'sad')).toBe(0);
            });

            it('getPastDays works as intended', () => {
                expect(summary.getPastDays(0)).toBe('Mon');
                expect(summary.getPastDays(1)).toBe('Tues');
                expect(summary.getPastDays(2)).toBe('Wed');
                expect(summary.getPastDays(3)).toBe('Thurs');
                expect(summary.getPastDays(4)).toBe('Fri');
                expect(summary.getPastDays(5)).toBe('Sat');
                expect(summary.getPastDays(6)).toBe('Sun');
            });

        });


        /** Tests the filtering used for charts when looking at past month ---------------------------------------------------------------------------------- **/

        describe('Chart Filtering - Past Month', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            userID: 'userID1',
                            emotion: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            userID: 'userID1',
                            emotion: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            userID: 'userID1',
                            emotion: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


                TestBed.configureTestingModule({
                    imports: [CustomModule, RouterTestingModule],
                    declarations: [SummaryListComponent, ArraySortPipe],
                    providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
                });
            });

            beforeEach(async(() => {
                TestBed.compileComponents().then(() => {
                    fixture = TestBed.createComponent(SummaryListComponent);
                    summary = fixture.componentInstance;
                    fixture.detectChanges();

                    summary.summaryEmotion = "All";
                    summary.summaryIntensity = "All";
                    summary.startDate = null;
                    summary.endDate = null;
                    summary.limitedPast = true;
                    summary.nowStamp = new Date('Sun Apr 08 2018 20:00:00 GMT-0000 (UTC)');
                    // Above means nowDate becomes 8
                    summary.nowDate = 8;
                    summary.lastMonthStamp = new Date('Thu Mar 08 2018 20:00:00 GMT-0000 (UTC)');
                    summary.inputType = "month";
                });
            }));

            it('filterGraph filters correctly for inputType = month', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterGraph(5, 'sad')).toBe(1);
                expect(summary.filterGraph(2, 'sad')).toBe(0);
            });

            it('modDate works as intended', () => {
                expect(summary.modDate(6)).toBe(14);
                expect(summary.modDate(0)).toBe(8);
                expect(summary.modDate(30)).toBe(7);
                summary.limitedPast = false;
                expect(summary.modDate(5)).toBe(5);
            });

            it('filterGraph works correctly when using modDate', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterGraph(summary.modDate(28), 'sad')).toBe(1);
                expect(summary.filterGraph(summary.modDate(1), 'sad')).toBe(0);
            });

            it('getPastDates works as intended', () => {
                //last month has 31 days
                summary.nowStamp = new Date('Sun Apr 08 2018 20:00:00 GMT-0000 (UTC)');
                summary.nowDate = 8;
                //summary.lastMonthStamp = new Date('Mon Feb 05 2018 20:00:00 GMT-0000 (UTC)');
                summary.lastMonth = 2;
                expect(summary.getPastDates(0)).toBe('9');
                expect(summary.getPastDates(6)).toBe('15');
                expect(summary.getPastDates(3)).toBe('12');

                //last month has 28 days
                summary.nowStamp = new Date('Thu Mar 08 2018 20:00:00 GMT-0000 (UTC)');
                summary.nowDate = 8;
                //summary.lastMonthStamp = new Date('Mon Feb 05 2018 20:00:00 GMT-0000 (UTC)');
                summary.lastMonth = 1;
                expect(summary.getPastDates(0)).toBe('6');
                expect(summary.getPastDates(6)).toBe('12');
                expect(summary.getPastDates(3)).toBe('9');

                //last month has 30 days
                summary.nowStamp = new Date('Tue May 08 2018 20:00:00 GMT-0000 (UTC)');
                summary.nowDate = 8;
                //summary.lastMonthStamp = new Date('Sun Apr 07 2018 20:00:00 GMT-0000 (UTC)');
                summary.lastMonth = 3;
                expect(summary.getPastDates(0)).toBe('8');
                expect(summary.getPastDates(6)).toBe('14');
                expect(summary.getPastDates(3)).toBe('11');

                //last month has 29 days (Leap Year)
                summary.nowStamp = new Date('Sun Mar 08 2020 20:00:00 GMT-0000 (UTC)');
                summary.nowDate = 8;
                //summary.lastMonthStamp = new Date('Thu Apr 06 2020 20:00:00 GMT-0000 (UTC)');
                summary.lastMonth = 1;
                expect(summary.getPastDates(0)).toBe('7');
                expect(summary.getPastDates(6)).toBe('13');
                expect(summary.getPastDates(3)).toBe('10');
            });

        });


        /** Tests the filtering used for charts when looking at past year ---------------------------------------------------------------------------------- **/

        describe('Chart Filtering - Past Year', () => {

            let summary: SummaryListComponent;
            let fixture: ComponentFixture<SummaryListComponent>;

            let summaryServiceStub: {
                getSummaries: () => Observable<Summary[]>
            };

            beforeEach(() => {
                // stub SummaryListService for test purposes
                summaryServiceStub = {
                    getSummaries: () => Observable.of([
                        {
                            _id: '1',
                            userID: 'userID1',
                            emotion: 'happy',
                            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 2,
                            description: 'slept',
                        },
                        {
                            _id: '2',
                            userID: 'userID1',
                            emotion: 'sad',
                            date: 'Thu Apr 05 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 4,
                            description: 'friend died',
                        },
                        {
                            _id: '3',
                            userID: 'userID1',
                            emotion: 'mad',
                            date: 'Sun Apr 08 2018 15:23:28 GMT-0000 (UTC)',
                            intensity: 5,
                            description: 'didn\'t sleep',
                        },
                    ])
                };


                TestBed.configureTestingModule({
                    imports: [CustomModule, RouterTestingModule],
                    declarations: [SummaryListComponent, ArraySortPipe],
                    providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
                });
            });

            beforeEach(async(() => {
                TestBed.compileComponents().then(() => {
                    fixture = TestBed.createComponent(SummaryListComponent);
                    summary = fixture.componentInstance;
                    fixture.detectChanges();

                    summary.summaryEmotion = 'All';
                    summary.summaryIntensity = 'All';
                    summary.startDate = null;
                    summary.endDate = null;
                    summary.limitedPast = true;
                    summary.nowStamp = new Date('Sun Apr 08 2018 20:00:00 GMT-0000 (UTC)');
                    // Above means nowMonth becomes 3
                    summary.nowMonth = 3;
                    summary.lastYearStamp = new Date('Sun Apr 08 2017 20:00:00 GMT-0000 (UTC)');
                    summary.inputType = "year";
                });
            }));

            it('filterGraph filters correctly for inputType = year', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterGraph(3, 'sad')).toBe(1);
                expect(summary.filterGraph(0, 'sad')).toBe(0);
            });

            it('modMonth works as intended', () => {
                expect(summary.modMonth(6)).toBe(10);
                expect(summary.modMonth(0)).toBe(4);
                expect(summary.modMonth(30)).toBe(10);
                summary.limitedPast = false;
                expect(summary.modMonth(5)).toBe(5);
            });

            it('filterGraph works correctly when using modMonth', () => {
                expect(summary.summaries.length).toBe(3);
                expect(summary.filterGraph(summary.modMonth(11), 'sad')).toBe(1);
                expect(summary.filterGraph(summary.modMonth(0), 'sad')).toBe(0);
            });

            it('getPastMonths works as intended', () => {
                expect(summary.getPastMonths(0)).toBe('May');
                expect(summary.getPastMonths(1)).toBe('June');
                expect(summary.getPastMonths(2)).toBe('July');
                expect(summary.getPastMonths(3)).toBe('Aug');
                expect(summary.getPastMonths(4)).toBe('Sep');
                expect(summary.getPastMonths(5)).toBe('Oct');
                expect(summary.getPastMonths(6)).toBe('Nov');
                expect(summary.getPastMonths(7)).toBe('Dec');
                expect(summary.getPastMonths(8)).toBe('Jan');
                expect(summary.getPastMonths(9)).toBe('Feb');
                expect(summary.getPastMonths(10)).toBe('Mar');
                expect(summary.getPastMonths(11)).toBe('Apr');
            });

        });







/** -------------------------------------------------------- ---------------------------------------------------------------------------------- **/
/*
describe('Misbehaving Summary ', () => {
    let summary: SummaryListComponent;
    let fixture: ComponentFixture<SummaryListComponent>;

    let summaryServiceStub: {
        getSummaries: () => Observable<Summary[]>
    };

    beforeEach(() => {
        // stub SummaryService for test purposes
        summaryServiceStub = {
            getSummaries: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [SummaryListComponent],
            providers: [{provide: SummaryListService, useValue: summaryServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SummaryListComponent);
            summary = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a SummaryService', () => {
        // Since the observer throws an error, we don't expect summaries to be defined.
        expect(summary.summaries).toBeUndefined();
    });
});
*/
