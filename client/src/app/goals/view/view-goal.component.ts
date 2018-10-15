import {Component, OnInit} from '@angular/core';
import {AppService} from "../../app.service";
import {Goal} from '../goal';
import {GoalsService} from "../goals.service";
import {EditGoalComponent} from "../edit/edit-goal.component";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute} from "@angular/router";
import {Location} from '@angular/common';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-view-goal.component',
    templateUrl: 'view-goal.component.html',
    styleUrls: ['./view-goal.component.scss'],
    providers: [AppService]
})

export class ViewGoalComponent implements OnInit {

    constructor(public appService: AppService,
                public goalListService: GoalsService,
                private route: ActivatedRoute,
                private _location: Location,
                public dialog: MatDialog,
                private snackBar: MatSnackBar) {
        this.route.params.subscribe(params => {
            this.id = params['_id'];
        });
    }

    public goals: Goal[] = [];
    public length: number;
    public index = 0;
    private highlightedID: {'$oid': string} = { '$oid': '' };
    public id: string;
    public goal: Goal = {
        _id: '',
        userID: '',
        purpose: '',
        category: '',
        name: '',
        status: null,
        frequency: '',
        start: '',
        end: '',
        next: '',
    };

    backClicked() {
        this._location.back();

    }

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
                this.goalListService.editGoal(result).subscribe(
                    editGoalResult => {
                        this.highlightedID = editGoalResult;
                        this.refreshGoal();
                        this.snackBar.open("Edited Goal", "CLOSE", {
                            duration: 2000,
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

    deleteGoal(_id: string) {
        this.goalListService.deleteGoal(_id).subscribe(
            goals => {
                console.log("first part");
                this.refreshGoal();
                //this.loadService();
            },
            err => {
                console.log(err);
                console.log("hi");
                this.refreshGoal();
                //this.loadService();
                this.snackBar.open("Deleted Goal", "CLOSE", {
                    duration: 2000,
                });
            }
        );
    }

    refreshGoal(): Observable<Goal> {
        const goalObservable: Observable<Goal> = this.goalListService.getGoalById(this.id);
        goalObservable.subscribe(
            data => {
                this.goal = data;
            },
            err => {
                console.log(err);
            });
        return goalObservable;
    }

    loadService(): void {
        this.goalListService.getGoalById(this.id).subscribe(
            data => {
                this.goal = data;
            },
            err => {
                console.log(err);
            }
        );
    }

    isHighlighted(goal: Goal): boolean {
        return goal._id['$oid'] === this.highlightedID['$oid'];
    }

    ngOnInit(): void {
        this.appService.testingToggle();
        this.refreshGoal();
        this.loadService();
    }

}
