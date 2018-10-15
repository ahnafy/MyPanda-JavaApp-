import {Component, OnInit} from '@angular/core';
import {GoalsService} from './goals.service';
import {Goal} from './goal';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AddGoalComponent} from './add/add-goal.component';
import {EditGoalComponent} from "./edit/edit-goal.component";
import {MatSnackBar} from '@angular/material';
import {AppService} from "../app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-goals-component',
    templateUrl: 'goals.component.html',
    styleUrls: ['./goals.component.scss'],
    providers: [AppService]
})

export class GoalsComponent implements OnInit {

    // Inject the GoalsService into this component.
    constructor(public goalService: GoalsService,
                public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public appService: AppService,
                private router: Router) {
    }

    // These are public so that tests can reference them (.spec.ts)
    public goals: Goal[] = []; //full list of goals
    public todayGoals: Goal[] = []; //goals that haven't been completed with accordance to their frequency
    public shownGoals: Goal[] = []; //goals that are being shown
    public goalStatus: string = 'all';
    public goalStart;
    public goalNext;
    public today;
    public showAllGoals = false;

    // Used for testing to set a static date so the same goals show up in today's goals regardless of actual date
    public testing = true;

    // The ID of the goal
    private highlightedID: { '$oid': string } = {'$oid': ''};

    isHighlighted(goal: Goal): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }

    // Opens a dialog for a new goal entry and adds the goal upon closing
    newGoalDialog(): void {
        const newGoal: Goal = {
            _id: '',
            userID: localStorage.getItem("userID"),
            name: '',
            category: '',
            purpose: '',
            status: false,
            start: this.goalStart,
            end: '',
            next: this.goalNext,
            frequency: ''
        };
        const dialogRef = this.dialog.open(AddGoalComponent, {
            width: '300px',
            data: {goal: newGoal}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a goal");
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.goalService.addNewGoal(result).subscribe(
                        addGoalResult => {
                            this.highlightedID = addGoalResult;
                            this.refreshGoals();
                            this.snackBar.open("Goal Created", "CLOSE", {
                                duration: 3000,
                            });
                            },
                            err => {
                                console.log('There was an error adding the goal.');
                                console.log('The error was ' + JSON.stringify(err));
                        });
                }
            }
        });
    }
// This function opens the editing window for the goals
    openEditGoalDialog(_id: string, purpose: string, category: string, name: string, status: boolean, frequency: string,
                       start: string, end: string, next: string): void {
        console.log("Edit goal button clicked.");
        console.log(_id + ' ' + name + purpose + end);
        console.log("this is next " + next);
        const newGoal: Goal = {_id: _id, userID: localStorage.getItem('userID'), purpose: purpose, category: category, name: name, status: status,
        frequency: frequency, start: start, end: end, next: next};
        const dialogRef = this.dialog.open(EditGoalComponent, {
            width: '300px',
            data: { goal: newGoal }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without editing the goal.");
            } else {
                this.goalService.editGoal(result).subscribe(
                    editGoalResult => {
                        this.highlightedID = editGoalResult;
                        this.refreshGoals();
                        this.snackBar.open("Goal Edited", "CLOSE", {
                            duration: 3000,
                        });
                        console.log("Goal edited.");
                    },
                    err => {
                        console.log('There was an error editing the goal.');
                        console.log('The error was ' + JSON.stringify(err));
                    });
            }
        });
    }

    //This function deletes a goal from the page
    deleteGoal(_id: string) {
        this.goalService.deleteGoal(_id).subscribe(
            goals => {
                this.refreshGoals();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshGoals();
                this.loadService();
                this.snackBar.open("Goal Deleted", "CLOSE", {
                    duration: 3000,
                });
            }
        );
    }

    //This function edits the specified goal
    editGoal(_id, name, purpose, category, status, frequency, start, end, next) {
        const updatedGoal: Goal = {
            _id: _id,
            userID: localStorage.getItem("userID"),
            purpose: purpose,
            category: category,
            name: name,
            status: status,
            frequency: frequency,
            start: start,
            end: end,
            next: next
        };
        this.goalService.editGoal(updatedGoal).subscribe(
            completeGoalResult => {
                this.highlightedID = completeGoalResult;
                if (status == true) {
                    this.snackBar.open("Goal Completed", "CLOSE", {
                        duration: 3000,
                    });
                } else {
                    this.snackBar.open("Goal Unchecked", "CLOSE", {
                        duration: 3000,
                    });
                }
                this.refreshGoals();
            },
            err => {
                console.log('There was an error completing the goal.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }

    //This Checks if the next field is <, = or > than today's date and updates the next field as needed. Returns
    //true if the goal is supposed to be shown in the today's goal section
    getNext(){
        console.log(this.showAllGoals);

        if(this.showAllGoals == false) {
            if(this.today !== undefined) {
                this.todayGoals = this.goals.filter(goal => {

                    var nextGoal = new Date(goal.next);
                    nextGoal.setHours(0, 0, 0, 0);

                    var endGoal = new Date(goal.end);
                    endGoal.setHours(0, 0, 0, 0);

                    var day = nextGoal.getDate();
                    var month = nextGoal.getMonth();

                    if (nextGoal.getTime() < this.today.getTime()
                        && goal.frequency != "Does not repeat"
                        && goal.status == true
                        && endGoal.getTime() >= this.today.getTime()) {
                        this.updateNext(goal._id, goal.name, goal.purpose, goal.category, false, goal.frequency, goal.start, goal.end, goal.next)
                    }

                    if (goal.status == true && nextGoal.getTime() == this.today.getTime()) {
                        return false;
                    }

                    if (endGoal.getTime() < this.today.getTime()) {
                        return false;
                    }

                    if (goal.frequency == 'Does not repeat') {
                        if (nextGoal.getTime() == this.today.getTime()) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }

                    if (goal.frequency != 'Does not repeat' &&
                        goal.frequency != 'Daily' &&
                        goal.frequency != 'Weekly' &&
                        goal.frequency != 'Monthly') {
                        return false;
                    }

                    while (nextGoal.getTime() < this.today.getTime()) {
                        if (goal.frequency == "Daily") {
                            day = day + 1;
                            nextGoal.setDate(day);
                        }

                        if (goal.frequency == "Weekly") {
                            day = day + 7;
                            nextGoal.setDate(day);
                        }

                        if (goal.frequency == "Monthly") {
                            month = month + 1;
                            nextGoal.setMonth(month);
                        }
                    }

                    if (nextGoal.getTime() == this.today.getTime()) {
                        this.updateNext(goal._id, goal.name, goal.purpose, goal.category, false, goal.frequency, goal.start, goal.end, nextGoal.toString());
                        return true;
                    }

                    else {
                        return false;
                    }

                });
            }

            this.showGoals("today");
            return this.todayGoals;
        }

        else {
            this.showGoals("all");
            return this.goals;
        }
    }

    //This function shows today's goals or all goals based on the the given type
    showGoals(type){

        if(type == "today") {

            if(this.todayGoals !== undefined) {
                this.shownGoals = this.todayGoals.filter(goal => {

                        return true;
                });
            }
        }

        else {
            this.shownGoals = this.goals.filter(goal => {
                    return true;
            });
        }
    }

    /**
     * Starts an asynchronous operation to update the goals list
     *
     */
    refreshGoals(): Observable<Goal[]> {
        // Get Goals returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        console.log("this is goals.component.ts and it has this for userID: " + localStorage.getItem("userID"));

        var userID = localStorage.getItem("userID");

        if(userID == null){
            userID = "";
        }
        const goalObservable: Observable<Goal[]> = this.goalService.getGoals(userID, this.goalStatus);
        console.log(goalObservable);
        goalObservable.subscribe(
            goals => {
                console.log(goals);
                if(goals != null){
                    this.goals = goals;
                    this.getNext();
                }
            },
            err => {
                console.log(err);
            });
        return goalObservable;
    }

    //loads the list of goals for the page
    loadService(): void {
        console.log(localStorage.getItem("userID"));
        this.goalService.getGoals(localStorage.getItem("userID"), this.goalStatus).subscribe(
            goals => {
                this.goals = goals;

                if(this.showAllGoals == true) {
                    this.shownGoals = this.goals;
                }
            },
            err => {
                console.log(err);
            }
        );
    }

    ////////////////////
    //Helper Functions//
    ////////////////////

    //get's today's date, and sets this.goalStart and this.goalNext to today's date
    getDate() {

        if(this.testing == true){
            this.today = new Date("2018-04-29T05:00:00.000Z");
        }

        else {
            this.today = new Date();
        }
        this.today.setHours(0, 0, 0, 0);

        this.goalStart = this.today;
        this.goalNext = this.today;
    }

    //returns the maximum number of pages there could possibly be based on the number of goals per page

    //updates the next field of the specified goal. Only is used when the page is loaded
    updateNext(_id, name, purpose, category, status, frequency, start, end, next): void {
        const updatedGoal: Goal = {
            _id: _id,
            userID: localStorage.getItem("userID"),
            purpose: purpose,
            category: category,
            name: name,
            status: status,
            frequency: frequency,
            start: start,
            end: end,
            next: next
        };
        this.goalService.editGoal(updatedGoal).subscribe(
            editGoalResult => {
                this.highlightedID = editGoalResult;
            },
            err => {
                console.log('There was an error completing the goal.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }

    // Returns "Complete" or "Incomplete" based on the given status
    returnStatus(status): string{
        if(status == true){
            return "Complete";
        }
        return "Incomplete";
    }


    //Runs when the page is initialized
    ngOnInit(): void {
        //For testing
        //toggle the value in app service to toggle testing
        this.appService.testingToggle();

        // Route consumer to home page if isSignedIn status is false
        if (!this.appService.isSignedIn()) {
            this.router.navigate(['']);
        }
        this.refreshGoals();
        this.loadService();
        this.getDate();
    }

}
