import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Link} from "../../link";
import {AppService} from "../../../app.service";

@Component({
    selector: 'app-add-link.component',
    templateUrl: 'add-link.component.html',
    styleUrls: ['./add-link.component.scss'],
    providers: [AppService],
})
//This adds the add link component to the link page
export class AddLinkComponent {


    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<AddLinkComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {link: Link}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


}
