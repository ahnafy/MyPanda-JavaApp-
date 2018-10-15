import {Component, OnInit} from '@angular/core';
import {AppService} from "../../app.service";
import {Journal} from '../journal';
import {JournalsService} from "../journals.service";
import {EditJournalComponent} from "../edit/edit-journal.component";
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-view-journal.component',
    templateUrl: 'view-journal.component.html',
    styleUrls: ['./view-journal.component.scss'],
    providers: [AppService]
})

export class ViewJournalComponent implements OnInit {

    constructor(public appService: AppService,
                public journalListService: JournalsService,
                private route: ActivatedRoute,
                private _location: Location,
                public dialog: MatDialog,
                private snackBar: MatSnackBar,
                private router: Router) {
        this.route.params.subscribe(params => {
            this.id = params['_id'];
        });
    }

    public journals: Journal[] = [];
    public length: number;
    public index = 0;
    private highlightedID: {'$oid': string} = { '$oid': '' };
    public id: string;
    public journal: Journal = {
        _id: '',
        userID: '',
        title: '',
        content: '',
        date: ''
    };

    backClicked() {
        this._location.back();

    }

    openEditJournalDialog(_id: string, title: string, content: string, date: string): void {
        console.log("Edit journal button clicked.");
        console.log(_id + ' ' + title + content + date);
        const newJournal: Journal = {_id: _id, userID: localStorage.getItem('userID'), title: title, content: content, date: date};
        const dialogRef = this.dialog.open(EditJournalComponent, {
            width: '300px',
            data: { journal: newJournal }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without editing the journal.");
            } else {
                this.journalListService.editJournal(result).subscribe(
                    editJournalResult => {
                        this.highlightedID = editJournalResult;

                        this.refreshJournal();
                        this.snackBar.open("Journal Edited", "CLOSE", {

                            duration: 2000,
                        });
                        console.log("Journal edited.");
                    },
                    err => {
                        // This should probably be turned into some sort of meaningful response.
                        console.log('There was an error editing the journal.');
                        console.log('The error was ' + JSON.stringify(err));
                    });
            }
        });
    }

    deleteJournal(_id: string) {
        this.journalListService.deleteJournal(_id).subscribe(
            journals => {
                console.log("first part");
                this.refreshJournal();
                //this.loadService();
            },
            err => {
                console.log(err);
                console.log("hi");
                this.refreshJournal();
                //this.loadService();
                this.snackBar.open("Journal Deleted", "CLOSE", {
                    duration: 2000,
                });
            }
        );
    }

    refreshJournal(): Observable<Journal> {
        const journalObservable: Observable<Journal> = this.journalListService.getJournalById(this.id);
        journalObservable.subscribe(
            data => {
                this.journal = data;
            },
            err => {
                console.log(err);
            });
        return journalObservable;
    }

    loadService(): void {
        this.journalListService.getJournalById(this.id).subscribe(
            data => {
                this.journal = data;
            },
            err => {
                console.log(err);
            }
        );
    }

    isHighlighted(journal: Journal): boolean {
        return journal._id['$oid'] === this.highlightedID['$oid'];
    }

    ngOnInit(): void {
        this.appService.testingToggle();

        // Route consumer to home page if isSignedIn status is false
        if (!this.appService.isSignedIn()) {
            this.router.navigate(['']);
        }

        this.refreshJournal();
        this.loadService();
    }

}
