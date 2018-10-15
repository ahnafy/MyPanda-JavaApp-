import {Component, OnInit} from '@angular/core';
import {JournalsService} from './journals.service';
import {Journal} from './journal';
import {Observable} from 'rxjs/Observable';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddJournalComponent} from './add/add-journal.component';
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import {OpenPromptsComponent} from "./prompt/open-prompts.component";

@Component({
    selector: 'app-journals-component',
    templateUrl: 'journals.component.html',
    styleUrls: ['./journals.component.scss'],
    providers: [AppService]
})

export class JournalsComponent implements OnInit {
    // These are public so that tests can reference them (.spec.ts)
    public journals: Journal[] = [];
    public filteredJournals: Journal[] = [];
    public search: string;
    public journalTitle: string;
    public journalContent: string;
    public journalDate: any;
    public length: number;
    public index = 0;
    public prompt: String;
    public prompts: String[] = [
        "What scares you?",
        "Do you have a plan? Do you need a plan? Have you had a plan fall spectacularly to pieces?",
        "What is your take on soul mates?",
        "Are you a worrier? Is there a particular worry that you can’t shake? How do you cope with worry?",
        "Dear past me",
        "Dear future me",
        "Places you’ve enjoyed visiting.",
        "Things you’ve done that you previously thought you could never do.",
        "The people you most admire",
        "Your favorite books",
        "Your favorite movies",
        "Your favorite songs",
        "Your top five short term goals",
        "Your top five long term goals are",
        "Nobody knows that I",
        "What’s the most outrageous thing you’ve ever done?",
        "What’s your secret desire?",
        "What’s the worst thing you’ve ever done?",
        "The most terrifying moment of my life was",
        "The most fun I’ve ever had",
        "The most surprised I’ve ever been",
        "The most disappointed I’ve ever been",
        "What are you looking forward to the most?",
        "Three celebrity crushes.",
        "Who made you feel good this week?",
        "Did you ever run away from home?",
        "Who was your best friend in elementary school?",
        "Did you ever get lost?",
        "If you could go back in time and change one things from your past, what would it be?",
        "If you could live anywhere you wanted, where would you live?",
        "If you could change one thing about your present life, what would it be?",
        "If you could meet any fictional character, who would it be?",
        "If you could have dinner with anyone currently alive, who would it be?",
        "Things I always did with my mom when I was little",
        "Things I always did with my dad when I was small",
        "The Holiday traditions I most look forward to",
        "My favorite Sunday ritual",
        "How easy is it for you to forgive those who have caused you pain?",
        "What is the dominant emotion in your life right now?",
        "How do you deal with anger?",
        "Some of the things that make me happy are",
        "My saddest memory is",
        "Three pet peeves",
        "Three favorite things to wear.",
        "What book did you read over and over again as a child?",
        "As a child, what did you want to be when you grew up?",
        "What was your favorite subject in school?",
        "What’s your first memory?",
        "What was your favorite cartoon?",
        "What is your most vivid memory of the kitchen in your childhood?",
        "As a child, who was your favorite relative?",
    ];

    // The ID of the journal
    private highlightedID: {'$oid': string} = { '$oid': '' };

    // Inject the JournalsService into this component.
    constructor(public journalListService: JournalsService,
                public dialog: MatDialog,
                public snackBar: MatSnackBar,
                public appService: AppService,
                private router: Router) {

    }

    randomPrompt(): void {
        this.prompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
    }

    openRandomPrompt(): void{

        this.prompt = this.prompts[Math.floor(Math.random() * this.prompts.length)];
        //this one is for mobile view
        console.log("Mobile-vied prompts icon clicked.");
         const dialogRef = this.dialog.open(OpenPromptsComponent, {
             width: '300px',
             height: '200px'
         });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without generating a prompt");
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.journalListService.RandomPromptsComponent(result).subscribe(
                        RandomPromptsComponentResult => {
                            this.highlightedID = RandomPromptsComponentResult;
                            this.refreshJournals();
                        },
                        err => {
                            console.log('There was an error adding the journal.');
                            console.log('The error was ' + JSON.stringify(err));
                        });
                }
            }
        });
        }


    openAddJournalDialog(): void {
        console.log("Add journal button clicked.");
        const newJournal: Journal = {_id: '', userID: localStorage.getItem('userID'), title: '', content: '', date: ''};
        const dialogRef = this.dialog.open(AddJournalComponent, {
            width: '300px',
            data: { journal: newJournal }

        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a journal.");
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.journalListService.addNewJournal(result).subscribe(
                        addJournalResult => {
                            this.highlightedID = addJournalResult;
                            this.refreshJournals();
                            },
                            err => {
                                console.log('There was an error adding the journal.');
                                console.log('The error was ' + JSON.stringify(err));
                        });
                    this.snackBar.open("Journal Created", "CLOSE", {
                        duration: 3000,
                    });
                    console.log("Journal added.");
                }
            }
        });
    }

    deleteJournal(_id: string) {
        this.journalListService.deleteJournal(_id).subscribe(
            journals => {
                console.log("first part");
                this.refreshJournals();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshJournals();
                this.loadService();
                this.snackBar.open("Journal Deleted", "CLOSE", {
                    duration: 3000,
                });
            }
        );
    }

    public filterJournals(search: string): Journal[] {

        this.filteredJournals = this.journals;

        // Filter by title
        if (search != null) {
            search = search.toLocaleLowerCase();

            this.filteredJournals = this.filteredJournals.filter(journal => {
                return !search || journal.title.toLowerCase().indexOf(search) !== -1
                               || journal.content.toLowerCase().indexOf(search) !== -1
                               || journal.date.toLowerCase().indexOf(search) !== -1;
            });
        }

        return this.filteredJournals;
    }

    // Starts an asynchronous operation to update the journals list
    refreshJournals(): Observable<Journal[]> {
        const journalListObservable: Observable<Journal[]> = this.journalListService.getJournals(localStorage.getItem("userID"));
        journalListObservable.subscribe(
            journals => {
                this.journals = journals;
                this.filterJournals(this.search);
                this.length = this.journals.length;
            },
            err => {
                console.log(err);
            });
        return journalListObservable;
    }

    loadService(): void {
        this.journalListService.getJournals(localStorage.getItem("userID")).subscribe(
            journals => {
                this.journals = journals;
                this.filteredJournals = this.journals;
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
        //For testing
        //toggle the value in app service to toggle testing
        this.appService.testingToggle();

        // Route consumer to home page if isSignedIn status is false
        if (!this.appService.isSignedIn()) {
            this.router.navigate(['']);
        }

        this.loadService();
        this.refreshJournals();
    }

}
