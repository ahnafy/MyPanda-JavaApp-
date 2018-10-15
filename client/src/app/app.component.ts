import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {AppService} from "./app.service";
import {Router, ActivationStart} from "@angular/router";
import {Location} from "@angular/common";
import {HostListener} from "@angular/core";
import {JournalsService} from "./journals/journals.service";
import {MatSnackBar} from "@angular/material";
import {GoalsService} from "./goals/goals.service";


declare var gapi: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [AppService, JournalsService, GoalsService]
})
export class AppComponent implements OnInit {
    googleAuth;
    public currentPath;
    public currentWidth;
    public currentId;
    public username: string;

    constructor(private http: HttpClient,
                public appService: AppService,
                private router: Router,
                private _location: Location,
                public journalListService: JournalsService,
                public snackBar: MatSnackBar,
                public goalListService: GoalsService) {

        this.router.events.subscribe((e) => {
            if (e instanceof ActivationStart) {
                this.currentPath = e.snapshot.routeConfig.path;
                this.currentId = e.snapshot.params['_id'];
            }
        })

        this.onResize();
    }

    deleteJournal(_id: string) {
        this.journalListService.deleteJournal(_id).subscribe(
            journals => {},
            err => {
                console.log(err);
                this.snackBar.open("Deleted Journal", "CLOSE", {
                    duration: 2000,
                });
            }
        );
    }

    deleteGoal(_id: string) {
        this.goalListService.deleteGoal(_id).subscribe(
            goals => {},
            err => {
                console.log(err);
                this.snackBar.open("Goal Deleted", "CLOSE", {
                    duration: 3000,
                });
            }
        );
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        this.currentWidth = window.innerWidth;
    }

    backClicked() {
        this._location.back();

    }
    // Checks if the user is on journal mobile view or desktop view
    // And sets according add, delete buttons in the navbar
    isJournalView(): boolean {
        if (this.currentPath == 'journals/:_id' && this.currentWidth < 600) {
            return true;
        } else {
            return false;
        }
    }
    // Checks if the user is on goal mobile view or desktop view
    // And sets according add, delete buttons in the navbar
    isGoalView(): boolean {
        if (this.currentPath == 'goals/:_id' && this.currentWidth < 600) {
            return true;
        } else {
            return false;
        }
    }
    // This requests and gets the name from local storage
    getUsername () {
        this.username = localStorage.getItem("userFirstName") + " " + localStorage.getItem("userLastName");
        if (this.username.length > 18) {
            this.username = this.username.slice(0, 17) + "...";
        }
    }
    // This signs in the user and opens the window for signing in
    signIn() {
        this.googleAuth = gapi.auth2.getAuthInstance();
        console.log(this.googleAuth);
        this.googleAuth.grantOfflineAccess().then((resp) => {
            localStorage.setItem('isSignedIn', 'true');
            this.sendAuthCode(resp.code);
        });
    }
    // This signs the user out
    signOut() {
        this.handleClientLoad();

        this.googleAuth = gapi.auth2.getAuthInstance();

        this.googleAuth.then(() => {
            this.googleAuth.signOut();
            localStorage.setItem('isSignedIn', 'false');
            localStorage.setItem("userID", "");
            window.location.reload();
        })
    }
    // This sends the auth code of our user to the server and stores the fields in local storage when we get data back
    // from gapi
    sendAuthCode(code: string): void {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        this.http.post(environment.API_URL + "login", {code: code}, httpOptions)
            .subscribe(onSuccess => {
                console.log("Code sent to server");
                console.log(onSuccess["_id"]);
                console.log(onSuccess["_id"]["$oid"]);
                console.log(onSuccess["FirstName"]);
                console.log(onSuccess["LastName"]);
                localStorage.setItem("userID", onSuccess["_id"]["$oid"]);
                localStorage.setItem("userFirstName", onSuccess["FirstName"]);
                localStorage.setItem("userLastName", onSuccess["LastName"]);
                localStorage.setItem("fontSelected", onSuccess["FontSetting"]);
                localStorage.setItem("styleSelected", onSuccess["StyleSetting"]);
            }, onFail => {
                console.log("ERROR: Code couldn't be sent to the server");
            });
    }

    handleClientLoad() {
        gapi.load('client:auth2', this.initClient);
    }

    initClient() {
        gapi.client.init({
            'clientId': '1080043572259-h76ostj5u9b5e9f6u2j695uin7pd5br5.apps.googleusercontent.com',
            'scope': 'profile email'
        });
    }

    ngOnInit() {
        this.handleClientLoad();
        gapi.load('client:auth2', this.initClient);
        this.getUsername();
    }
}
