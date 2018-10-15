import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from '../journal';
import {AppService} from "../../app.service";

@Component({
    selector: 'app-edit-journal.component',
    templateUrl: 'edit-journal.component.html',
    styleUrls: ['./edit-journal.component.scss'],
    providers: [AppService],
})
// Adds an EditJournalComponent to the Edit Page
export class EditJournalComponent {
    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<EditJournalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
