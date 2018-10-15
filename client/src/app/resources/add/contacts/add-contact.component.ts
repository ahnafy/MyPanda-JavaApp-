import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Contact} from "../../contact";
import {AppService} from "../../../app.service";

@Component({
    selector: 'app-add-contact.component',
    templateUrl: 'add-contact.component.html',
    styleUrls: ['./add-contact.component.scss'],
    providers: [AppService],
})
// This function adds the addContact Component to the add page
export class AddContactComponent {


    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<AddContactComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {contact: Contact}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


}
