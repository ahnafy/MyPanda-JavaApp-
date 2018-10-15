import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Journal} from './journal';
import {JournalsComponent} from './journals.component';
import {JournalsService} from './journals.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import {ArraySortPipe} from "./array-sort.pipe";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";

describe( 'Journals', () => {

    let journalList: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;

    let journalServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub JournalsService for test reasons
        journalServiceStub = {
            getJournals: () => Observable.of([
                {
                    _id: 'buying_id',
                    userID: 'userID1',
                    title: 'Buying food',
                    content: 'I went to the ice cream store today for a sundae.',
                    date: "Sat Jan 27 13:36:47 CST 2018"
                },
                {
                    _id: 'visit_id',
                    userID: 'userID2',
                    title: 'Visit mom',
                    content: 'I went to my Mom\'s house to talk to her.',
                    date: "Sun Feb 12 16:32:41 CST 2018"
                },
                {
                    _id: 'running_id',
                    userID: 'userID3',
                    title: 'Go on run',
                    content: 'I went on a 25 mile run today!',
                    date: "Mon Mar 11 19:26:37 CST 2018"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule, RouterTestingModule],
            declarations: [JournalsComponent, ArraySortPipe],
            providers: [{provide: JournalsService, useValue: journalServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('contains all the journals', () => {
        expect(journalList.journals.length).toBe(3);
    });

    it('contains a title called \'Buying food\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.title === 'Buying food')).toBe(true);
    });

    it('contains a title called \'Visit mom\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.title === 'Visit mom')).toBe(true);
    });

    it('contains a content called \'I went on a 25 mile run today!\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.content === 'I went on a 25 mile run today!')).toBe(true);
    });

    it('doesn\'t contain a title called \'Meet with Santa\'', () => {
        expect(journalList.journals.some((journal: Journal) => journal.title === 'Meet with Santa')).toBe(false);
    });

    it('has a journal dated: Sun Feb 12 16:32:41 CST 2018', () => {
        expect(journalList.journals.some((journal: Journal) => journal.date === 'Sun Feb 12 16:32:41 CST 2018')).toBe(true);
    });

    it('journal list filters by search for a certain title', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.search = 'food';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(1);
        });
    });

    it('journal list filters by search for a certain content', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.search = 'today';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(2);
        });
    });

    it('journal list filters by search for a certain date', () => {
        expect(journalList.filteredJournals.length).toBe(3);
        journalList.search = 'Jan';
        journalList.refreshJournals().subscribe(() => {
            expect(journalList.filteredJournals.length).toBe(1);
        });
    });

});

// This test is not passing because of sending XML requests. Fix!
/*describe('Misbehaving Journal List', () => {
    let journalList: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>
    };

    beforeEach(() => {
        // stub JournalsService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.create(observer => {
                observer.error('Error-prone observable');
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [JournalsComponent, ArraySortPipe],
            providers: [{provide: JournalsService, useValue: journalListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('generates an error if we don\'t set up a JournalsService', () => {
        // Since the observer throws an error, we don't expect journals to be defined.
        expect(journalList.journals).toBeUndefined();
    });
});*/

describe('Adding a journal', () => {
    let journalList: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;
    const newJournal: Journal =   {
        _id: '',
        userID: 'userID4',
        content: 'To stay awake writing tests',
        title: 'Drink coffee',
        date: "Sun Feb 16 17:12:43 CST 2018"
    };
    const newId = 'coffee_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        addNewJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (JournalListComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalsService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            addNewJournal: (journalToAdd: Journal) => {
                calledJournal = journalToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [JournalsComponent, ArraySortPipe],
            providers: [
                {provide: JournalsService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    it('calls JournalsService.addJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openAddJournalDialog();
        expect(calledJournal).toEqual(newJournal);
    });
});

/*
describe('Editing a journal', () => {
    let journalList: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;
    const editJournal: Journal =   {
        _id: '',
        userID: 'userID5',
        content: 'I fell asleep in class today',
        title: 'Classes',
        date: "Sun Feb 16 17:12:43 CST 2018"
    };
    const newId = 'class_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        editJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (JournalsComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalsService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            editJournal: (journalToEdit: Journal) => {
                calledJournal = journalToEdit;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(editJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [JournalsComponent, ArraySortPipe],
            providers: [
                {provide: JournalsService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls JournalsService.editJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openEditJournalDialog(this._id, this.title, this.content, this.date);
        expect(calledJournal).toEqual(editJournal);
    });
});
*/
