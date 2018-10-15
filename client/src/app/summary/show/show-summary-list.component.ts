import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Summary} from '../summary';
import {AppService} from "../../app.service";

@Component({
    selector: 'app-show-summary-list.component',
    templateUrl: 'show-summary-list.component.html',
    styleUrls: ['./show-summary-list.component.scss'],
    providers: [AppService],
})
// Opens the Show Summary component
export class ShowSummaryListComponent {
    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<ShowSummaryListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {summary: Summary}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
        console.log("Show summary dialog closed.")
    }

}
