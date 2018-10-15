import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Journal} from './journal';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';


@Injectable()
export class JournalsService {
    readonly baseUrl: string = environment.API_URL + 'journals';
    private journalUrl: string = this.baseUrl;
    private noID: boolean = false;
    private emptyObservable: Observable<Journal[]> = Observable.of([]);

    constructor(private http: HttpClient) {
    }
// This funtion calls the journals collection and added to the journals page component.
    getJournals(userID: string, journalBody?: string): Observable<Journal[]> {
        this.journalUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);

        //require a userID
        if(this.noID){
            return this.emptyObservable;
        }
        console.log(this.journalUrl);

        return this.http.get<Journal[]>(this.journalUrl);
    }
// This function calls a journal with their specific ID
    getJournalById(id: string): Observable<Journal> {
        this.journalUrl = this.baseUrl;
        return this.http.get<Journal>(this.journalUrl + '/' + id);
    }
// This function adds a filter by title functionality
    filterByTitle(journalTitle?: string): void {
        if (!(journalTitle == null || journalTitle === '')) {
            if (this.parameterPresent('title=') ) {
                this.removeParameter('title=');
            }
            if (this.journalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.journalUrl += 'title=' + journalTitle + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.journalUrl += '?title=' + journalTitle + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('title=')) {
                let start = this.journalUrl.indexOf('title=');
                const end = this.journalUrl.indexOf('&', start);
                if (this.journalUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.journalUrl = this.journalUrl.substring(0, start) + this.journalUrl.substring(end + 1);
            }
        }
    }
// This filters the journals with the specific userID you are using so you do not see someone else's journals
    filterByUserID(userID: string): void {
        if (!(userID == null || userID === '')) {
            if (this.parameterPresent('userID=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('userID=');
            }
            if (this.journalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.journalUrl += 'userID=' + userID + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.journalUrl += '?userID=' + userID + '&';
            }
        } else {
            // there was no userID
            this.noID = true;
        }
    }

    private parameterPresent(searchParam: string) {
        return this.journalUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.journalUrl.indexOf(searchParam);
        let end = 0;
        if (this.journalUrl.indexOf('&') !== -1) {
            end = this.journalUrl.indexOf('&', start) + 1;
        } else {
            end = this.journalUrl.indexOf('&', start);
        }
        this.journalUrl = this.journalUrl.substring(0, start) + this.journalUrl.substring(end);
    }

    addNewJournal(newJournal : Journal): Observable<{'$oid': string}> {
        this.journalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(newJournal);
        // Send post request to add a new journal with the journal data as the content with specified headers.
        return this.http.post<{'$oid': string}>(this.journalUrl + '/new', newJournal, httpOptions);
    }

    RandomPromptsComponent(generatePrompts : Journal)  {

        this.journalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(generatePrompts);
        // Send post request to generate new Prompts
        return this.http.post<{'$oid': string}>(this.journalUrl + '/new', generatePrompts, httpOptions);

}

    editJournal(id : Journal): Observable<{'$oid': string}> {
        this.journalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(id);
        // Send post request to edit journal.
        return this.http.post<{'$oid': string}>(this.journalUrl + '/edit', id, httpOptions);
    }
// This function adds the delete journal functionality
    deleteJournal(journalID: String) {
        this.journalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to delete journal.
        return this.http.delete(this.journalUrl + '/delete/' + journalID, httpOptions);
    }
}
