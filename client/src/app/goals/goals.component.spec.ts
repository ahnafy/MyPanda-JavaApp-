import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Goal} from './goal';
import {GoalsComponent} from './goals.component';
import {GoalsService} from './goals.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {ArraySortPipe} from "../journals/array-sort.pipe";
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";

describe( 'Goals', () => {

    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    const newId = 'class_id';
    let calledGoal: Goal;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>
        editGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };

    beforeEach(() => {
        // stub GoalsService for test reasons
        goalsServiceStub = {
            getGoals: () => Observable.of([
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
                },
                {
                    "_id": "5ab53a890c2c77662aaf3801",
                    userID: 'userID1',
                    "purpose": "To feel closer to him",
                    "category": "Family",
                    "name": "Write letter to Grandpa",
                    "status": false,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2019-04-05T18:56:24.702Z",
                    "next": "2018-04-05T18:56:24.702Z",
                    "frequency": "Daily"
                },
                {
                    "_id":  "5ab53a8944c7c6b223090477",
                    userID: 'userID1',
                    "purpose": "To get more sleep",
                    "category": "Personal Health",
                    "name": "Go to bed early",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-07-05T18:56:24.702Z",
                    "next": "2018-05-05T18:56:24.702Z",
                    "frequency": "Monthly"
                },
                {
                    "_id": "5ab53a898e1620e3d7e48796",
                    userID: 'userID1',
                    "purpose": "To give her a piece of my mind",
                    "category": "Family",
                    "name": "Visit sister",
                    "status": false,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-06-05T18:56:24.702Z",
                    "next": "2018-04-06T18:56:24.702Z",
                    "frequency": "Daily"
                }
                ]),

            editGoal: (goalToEdit: Goal) => {
                calledGoal = goalToEdit;
                return Observable.of({
                    '$oid': newId
                });
            }
        };

        TestBed.configureTestingModule({
            imports: [CustomModule, RouterTestingModule],
            declarations: [GoalsComponent, ArraySortPipe],
            providers: [{provide: GoalsService, useValue: goalsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    //General Tests
    it('contains all the goals', () => {
        expect(goalList.goals.length).toBe(4);
    });

    it('contains a name called \'Go to bed early\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Go to bed early')).toBe(true);
    });

    it('contains a name called \'Call my mom\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Call my mom')).toBe(true);
    });

    it('contains a purpose called \'To give her a piece of my mind\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.purpose === 'To give her a piece of my mind')).toBe(true);
    });

    it('doesn\'t contain a name called \'Meet with Santa\'', () => {
        expect(goalList.goals.some((goal: Goal) => goal.name === 'Meet with Santa')).toBe(false);
    });

    it('has two goals that are true', () => {
        expect(goalList.goals.filter((goal: Goal) => goal.status === true).length).toBe(2);
    });

    it('returnStatus should return "complete" if the status is true',()=>{
       expect(goalList.returnStatus(true)).toBe("Complete");

    });


    it('goal list shows all goals', () =>{
        expect(goalList.goals.length).toBe(4);
        goalList.showAllGoals = true;
        goalList.refreshGoals().subscribe(()=>{
            expect(goalList.goals.length).toBe(4);
        });
    });

    it('returnStatus returns "complete"', () =>{
        expect(goalList.returnStatus(true) === "Complete");
    });

    it('returnStatus returns "incomplete"', () =>{
        expect(goalList.returnStatus(false) === "Incomplete");
    });

    it('showGoals returns all goals', () =>{
        expect(goalList.goals.length).toBe(4);
        goalList.showGoals("all");
        expect(goalList.shownGoals.length).toBe(4);
    });

    it('getNext returns todays goals',()=>{
        expect(goalList.goals.length).toBe(4);
        goalList.showAllGoals = false;
        goalList.getNext();
        expect(goalList.shownGoals.length).toBe(2)
    })
});

describe('Next Goals', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;

    let goalsServiceStub: {
        getGoals: () => Observable<Goal[]>
    };

    beforeEach(() => {
        // stub GoalsService for test reasons
        goalsServiceStub = {
            getGoals: () => Observable.of([
                {
                    "_id": "5ab53a89551a3d783599082c",
                    "userID": 'userID1',
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-05T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": undefined
                },
                {
                    "_id": "5ab53a89551a3d783599082c",
                    "userID": 'userID1',
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": true,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-25T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": "Weekly"
                },
                {
                    "_id": "5ab53a89551a3d783599082c",
                    "userID": 'userID1',
                    "purpose": "Improve relationship",
                    "category": "Family",
                    "name": "Call my mom",
                    "status": false,
                    "start": "2018-04-05T18:56:24.702Z",
                    "end": "2018-05-20T18:56:24.702Z",
                    "next": "2018-04-12T18:56:24.702Z",
                    "frequency": undefined
                },
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule, RouterTestingModule],
            declarations: [GoalsComponent, ArraySortPipe],
            providers: [{provide: GoalsService, useValue: goalsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });

        //Checks if going to the 'all' goals page skips the while loop
        it('Doesnt enter while loop', () => {
            expect(goalList.goals.length).toBe(2);
            goalList.showAllGoals = true;
            expect(goalList.todayGoals.length).toBe(0);
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));
});


describe('Adding a goal', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const newGoal: Goal =   {
        _id: '',
        userID: 'userID1',
        purpose: 'To stay awake writing tests',
        category: 'Personal Health',
        name: 'Drink coffee',
        status: false,
        start: "2018-04-05T18:56:24.702Z",
        end: "2018-05-05T18:56:24.702Z",
        next: "2018-05-05T18:56:24.702Z",
        frequency: "Daily"
    };
    const newId = 'health_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>,
        addNewGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (GoalsComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        let highlightedID: { '$oid': string } = {'$oid': ''};
        // stub GoalsService for test reasons
        goalListServiceStub = {
            getGoals: () => Observable.of([]),
            addNewGoal: (goalToAdd: Goal) => {
                calledGoal = goalToAdd;
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
            declarations: [GoalsComponent, ArraySortPipe],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    //Checks if a goal is added correctly
    it('calls GoalsService.addGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.newGoalDialog();
        expect(goalList.isHighlighted(calledGoal));
        expect(calledGoal).toEqual(newGoal);
    });
});

describe('Deleting a goal', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const deleteGoal: Goal =   {
        _id: '',
        userID: 'userID1',
        purpose: 'To have a delightful tasting sensation',
        category: 'Personal Health',
        name: 'Eat pringles',
        status: false,
        start: "2018-04-05T18:56:24.702Z",
        end: "2018-05-05T18:56:24.702Z",
        next: "2018-05-05T18:56:24.702Z",
        frequency: "Daily"
    };
    const newId = 'pringles_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>,
        deleteGoal: (deleteGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (GoalsComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        // stub GoalsService for test reasons
        goalListServiceStub = {
            getGoals: () => Observable.of([]),
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
            declarations: [GoalsComponent, ArraySortPipe],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    //Checks if deleting a goal works
    it('calls GoalsService.deleteGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.deleteGoal(this._id);
    });
});

describe('Editing a goal', () => {
    let goalList: GoalsComponent;
    let fixture: ComponentFixture<GoalsComponent>;
    const newGoal: Goal =   {
        _id: '',
        userID: 'userID1',
        purpose: 'To stay awake writing tests',
        category: 'Personal Health',
        name: 'Drink coffee',
        status: false,
        start: "2018-04-05T18:56:24.702Z",
        end: "2018-05-05T18:56:24.702Z",
        next: "2018-05-05T18:56:24.702Z",
        frequency: "Daily"
    };
    const newId = 'health_id';

    let calledGoal: Goal;

    let goalListServiceStub: {
        getGoals: () => Observable<Goal[]>,
        editGoal: (newGoal: Goal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (GoalsComponent, any) => {
            afterClosed: () => Observable<Goal>
        };
    };

    beforeEach(() => {
        calledGoal = null;
        let highlightedID: { '$oid': string } = {'$oid': ''};
        // stub GoalsService for test reasons
        goalListServiceStub = {
            getGoals: () => Observable.of([]),
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
            declarations: [GoalsComponent, ArraySortPipe],
            providers: [
                {provide: GoalsService, useValue: goalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(GoalsComponent);
            goalList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    //Checks if a goal is added correctly
    it('calls GoalsService.editGoal', () => {
        expect(calledGoal).toBeNull();
        goalList.openEditGoalDialog(this._id, this.purpose, this.category, this.name, this.status,
            this.frequency, this.start, this.end, this.next);
        expect(goalList.isHighlighted(calledGoal));
        expect(calledGoal).toEqual(newGoal);
    });
});

