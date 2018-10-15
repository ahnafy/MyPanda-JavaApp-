import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Summary} from './summary';
import {environment} from '../../environments/environment';


@Injectable()
export class SummaryListService {
    readonly baseUrl: string = environment.API_URL + 'summaries';
    private summaryUrl: string = this.baseUrl;
    private noID: boolean = false;
    private emptyObservable: Observable<Summary[]> = Observable.of([]);

    constructor(private http: HttpClient) {
    }

    getSummaries(userID: string, summaryEmotion?: string,): Observable<Summary[]> {
        this.summaryUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);
        this.filterByEmotion(summaryEmotion);

        if(this.noID) {
            return this.emptyObservable;
        }
        console.log(this.summaryUrl);

        return this.http.get<Summary[]>(this.summaryUrl);
    }

    filterByUserID(userID: string): void {
        if (!(userID == null || userID === '')) {
            if (this.parameterPresent('userID=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('userID=');
            }
            if (this.summaryUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.summaryUrl += 'userID=' + userID + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.summaryUrl += '?userID=' + userID + '&';
            }
        } else {
            // there was no userID
            this.noID = true;
        }
    }

    filterByEmotion(summaryEmotion?: string): void {
        if (!(summaryEmotion == null || summaryEmotion === '')) {
            if (this.parameterPresent('emotion=') ) {
                // there was a previous search by company that we need to clear
                this.removeParameter('emotion=');
            }
            if (this.summaryUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.summaryUrl += 'emotion=' + summaryEmotion + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.summaryUrl += '?emotion=' + summaryEmotion + '&';
            }
        } else {
            // there was nothing in the box to put onto the URL... reset
            if (this.parameterPresent('emotion=')) {
                let start = this.summaryUrl.indexOf('emotion=');
                const end = this.summaryUrl.indexOf('&', start);
                if (this.summaryUrl.substring(start - 1, start) === '?') {
                    start = start - 1;
                }
                this.summaryUrl = this.summaryUrl.substring(0, start) + this.summaryUrl.substring(end + 1);
            }
        }
    }

    private parameterPresent(searchParam: string) {
        return this.summaryUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.summaryUrl.indexOf(searchParam);
        let end = 0;
        if (this.summaryUrl.indexOf('&') !== -1) {
            end = this.summaryUrl.indexOf('&', start) + 1;
        } else {
            end = this.summaryUrl.indexOf('&', start);
        }
        this.summaryUrl = this.summaryUrl.substring(0, start) + this.summaryUrl.substring(end);
    }
}

