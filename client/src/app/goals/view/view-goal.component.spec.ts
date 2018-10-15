import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Goal} from '../goal';
import {GoalsService} from '../goals.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {ViewGoalComponent} from './view-goal.component';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";


describe('Editing a goal', () => {
    let goalList: ViewGoalComponent;
    let fixture: ComponentFixture<ViewGoalComponent>;
    const newGoal: Goal =   {
        "_id": "5ab53a89551a3d783599082c",
        userID: 'userID1',
        "purpose": "Improve relationship",
        "category": "Family",
        "name": "Call my mom",
        "status": true,
        "start": "2018-04-05T18:56:24.702Z",
        "end": "2018-05-05T18:56:24.702Z",
        "next": "2018-04-12T18:56:24.702Z",
        "frequency": "Weekly"
    };
    const newId = 'class_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoalById: () => Observable<Goal>,
        editGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ViewJournalComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        let highlightedID: { '$oid': string } = {'$oid': ''};
        // This stub JournalsService for test reasons
        goalListServiceStub = {
            getGoalById: () => Observable.of(
                {
                    "_id": "5ab53a89551a3d783599082c",
                    userID: 'userID1',
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-05T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": "Weekly"
                }
            ),
            editGoal: (goalToEdit: Goal) => {
                calledGoal = goalToEdit;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        highlightedID = {'$oid': newGoal._id};
                        return Observable.of(newGoal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [ViewGoalComponent],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ViewGoalComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    it('calls GoalsService.editGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.openEditGoalDialog(this._id, this.purpose, this.category, this.name,
            this.status, this.frequency, this.start, this.end, this.next);
        expect(goalList.isHighlighted(calledGoal));
        expect(calledGoal).toEqual(newGoal);
    });
});

describe('Deleting a goal', () => {
    let goalList: ViewGoalComponent;
    let fixture: ComponentFixture<ViewGoalComponent>;
    const deleteGoal: Goal =   {
        "_id": "5ab53a89551a3d783599082c",
        userID: 'userID1',
        "purpose": "Improve relationship",
        "category": "Family",
        "name": "Call my mom",
        "status": true,
        "start": "2018-04-05T18:56:24.702Z",
        "end": "2018-05-05T18:56:24.702Z",
        "next": "2018-04-12T18:56:24.702Z",
        "frequency": "Weekly"
    };
    const newId = 'pringles_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoalById: () => Observable<Goal>,
        deleteGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ViewJournalComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        let highlightedID: { '$oid': string } = {'$oid': ''};
        // stub JournalsService for test reasons
        goalListServiceStub = {
            getGoalById: () => Observable.of(
                {
                    "_id": "5ab53a89551a3d783599082c",
                    userID: 'userID1',
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-05T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": "Weekly"
                }
            ),
            deleteGoal: (goalToDelete: Goal) => {
                calledGoal = goalToDelete;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(deleteGoal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [ViewGoalComponent],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ViewGoalComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls GoalsService.deleteGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.deleteGoal(this._id);
    });
});
