import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from '../journal';
import {AppService} from "../../app.service";

@Component({
    selector: 'app-add-journal.component',
    templateUrl: 'add-journal.component.html',
    styleUrls: ['./add-journal.component.scss'],
    providers: [AppService],
})

// This function adds the addJournalComponent to the journal component
export class AddJournalComponent {


    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<AddJournalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

   }
