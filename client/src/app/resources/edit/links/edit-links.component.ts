import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Link} from "../../link";
import {AppService} from "../../../app.service";

@Component({
    selector: 'app-edit-links.component',
    templateUrl: 'edit-links.component.html',
    styleUrls: ['./edit-links.component.scss'],
    providers: [AppService],
})

export class EditLinkComponent {
    constructor(
        public appService: AppService,
        public dialogRef: MatDialogRef<EditLinkComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {link: Link}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
