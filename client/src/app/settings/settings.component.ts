import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import {AppService} from "../app.service";
import {SettingsService} from "./settings.service";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'settingscomponent',
    templateUrl: 'settings.component.html',
    styleUrls: ['./settings.component.scss'],
    providers: [AppService, HttpClient, SettingsService]
})

export class SettingsComponent implements OnInit{

    constructor(public appService: AppService,
                public settingsService: SettingsService,
                public router: Router) {}

    public font: string = "";
    public theme: string = "";


    saveSettings(){
        if(this.font != localStorage.getItem("fontSelected")){
            this.settingsService.editFont(localStorage.getItem("userID"), this.font).subscribe(
                result=>{
                    localStorage.setItem("fontSelected", result)
                },
                err => {
                    console.log('The error was ' + JSON.stringify(err));
                }
            );
        }

        if(this.theme != localStorage.getItem("styleSelected")){
            this.settingsService.editStyle(localStorage.getItem("userID"), this.theme).subscribe(
                result=>{

                    localStorage.setItem("styleSelected", result)
                },
                err => {
                    console.log('The error was ' + JSON.stringify(err));
                }
            );
        }
    }


    ngOnInit(): void {
        if (!this.appService.isSignedIn()) {
            this.router.navigate(['']);
        }

        if (this.font == null || this.font == ''){
            this.font = localStorage.getItem("fontSelected");
        }
        if (this.theme == null || this.theme == ''){
            this.theme = localStorage.getItem("styleSelected");
        }
    }
}

