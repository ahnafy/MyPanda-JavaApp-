import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Goal} from '../goal';
import {AppService} from "../../app.service";

@Component({
    selector: 'app-add-goal.component',
    templateUrl: 'add-goal.component.html',
    styleUrls: ['./add-goal.component.scss'],
    providers: [AppService]
})

// This adds the addGoalComponent function to the goals component
export class AddGoalComponent {
    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<AddGoalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {goal: Goal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
