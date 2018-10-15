import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Journal} from '../journal';

@Component({
    selector: 'app-open-prompts.component',
    templateUrl: 'open-prompts.component.html',
    styleUrls: ['./open-prompts.component.scss'],
})

export class OpenPromptsComponent implements OnInit{
    public prompt: String;
// This is the array of random prompts. If you wanna add a random prompt. Add here.
    public promptsMobile: String[] = [
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
        "As a child, who was your favorite relative?",    ];


    constructor(
        public dialogRef: MatDialogRef<OpenPromptsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {journal: Journal}) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


    randomPromptsMobile(): void {
        this.prompt = this.promptsMobile[Math.floor(Math.random() * this.promptsMobile.length)];
    }

    ngOnInit (): void {

        this.randomPromptsMobile();
    }

}
