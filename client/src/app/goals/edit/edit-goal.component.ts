import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Goal} from '../goal';
import {AppService} from "../../app.service";

@Component({
    selector: 'app-edit-goal.component',
    templateUrl: 'edit-goal.component.html',
    styleUrls: ['./edit-goal.component.scss'],
    providers: [AppService],
})
// This function adds the EditGoalComponent to the Goals component
export class EditGoalComponent {
    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<EditGoalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {goal: Goal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
