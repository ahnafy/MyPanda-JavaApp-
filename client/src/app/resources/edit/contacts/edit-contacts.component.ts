import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Contact} from "../../contact";
import {AppService} from "../../../app.service";

@Component({
    selector: 'edit-contacts.component',
    templateUrl: 'edit-contacts.component.html',
    styleUrls: ['./edit-contacts.component.scss'],
    providers: [AppService],
})
// This adds the EditContactComponent to the contact collection and page
export class EditContactComponent {
    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<EditContactComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {contact: Contact}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
