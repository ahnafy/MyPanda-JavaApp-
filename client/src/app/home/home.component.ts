import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {EmotionService} from './home.service';
import {Emotion} from './emotion';
import {environment} from '../../environments/environment';
import {AppService} from "../app.service";

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [AppService]
})
export class HomeComponent implements OnInit {

    readonly baseUrl: string = environment.API_URL + 'emotions';

    private highlightedID: { '$oid': string } = {'$oid': ''};

    public selectedEmotion = "none";
    public emotionDescription: string;
    public emotionDate: string;
    public emojiRating: number = 0;

    //This function reloads the window and resets the page when the user clicks the reset button
    restart() {
        this.resetPage();
        window.location.reload();
    }

    // Adds slider functionality
    thumbLabel = true;

    constructor(public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public emotionService: EmotionService,
                public appService: AppService) {
    }

    //Sets the selected emotion and calls the CSS that adds the border around the image
    selectEmotion(ID) {
        if (this.selectedEmotion != 'none') {
            this.resetSelections()
        }
        this.selectedEmotion = ID;
        let newClass = document.getElementById(ID);
        if (newClass != null) {
            newClass.classList.add('on');
        }
    }

    //Removes the border from the current selected emotion
    private resetSelections() {
        let newClass = document.getElementById(this.selectedEmotion);
        if (newClass != null) {
            newClass.classList.remove('on');
        }
    }

    //Saves the emotion to the server
    saveEmotion(): void {
        const newEmotion: Emotion = {
            _id: '',
            userID: localStorage.getItem("userID"),
            emotion: this.selectedEmotion,
            intensity: this.emojiRating,
            description: this.emotionDescription,
            date: this.emotionDate
        };

        if (localStorage.isSignedIn == "true") {

            console.log(newEmotion);
            this.emotionService.addNewEmotion(newEmotion).subscribe(
                addEmotionResult => {
                    this.highlightedID = addEmotionResult;
                    this.snackBar.open("Response Submitted", "CLOSE", {
                        duration: 2000,
                    });
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the emotion.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        } else {
            this.snackBar.open("Response Not Saved. Please Log In to Save Your Response", "CLOSE", {
                duration: 5000,
            });
        }
    }

    //Helper Functions//

    //Gets today's date and sets this.emotionDate to today's date
    getDate() {
        let today = new Date();
        this.emotionDate = today.toString();
    }

    //Completely resets the page
    resetPage() {
        this.resetSelections();
        this.selectedEmotion = "none";
        this.emojiRating = 0;
        this.emotionDescription = "";
    }

    //Enables the next button when the user selects an emotion and an intensity
    showNextButtonEmotion() {
        if (this.selectedEmotion != "none") {
            return false;
        } else {
            return true;
        }
    }

    showNextButtonIntensity() {
        if (this.emojiRating != 0) {
            return false;
        } else {
            return true;
        }
    }

    ngOnInit(): void {
        //For testing
        //toggle the value in app service to toggle testing
        this.appService.testingToggle();
    }

}
