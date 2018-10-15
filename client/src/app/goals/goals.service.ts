import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Goal} from './goal';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';



@Injectable()
export class GoalsService {
    readonly baseUrl: string = environment.API_URL + 'goals';
    private goalUrl: string = this.baseUrl;
    private noID: boolean = false;
    private emptyObservable: Observable<Goal[]> = Observable.of([]);

    constructor(
        private http: HttpClient) {
    }

    //This function gets goals from the server
    getGoals(userID: string, status?: string): Observable<Goal[]> {
        this.goalUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);

        //require a userID
        if(this.noID){
            return this.emptyObservable;
        }

        //add status filter
        if (status != null && status != "all") {
            this.goalUrl += 'status=' + status + '&';
        }

        console.log(this.goalUrl);
        return this.http.get<Goal[]>(this.goalUrl);
    }

    getGoalById(id: string): Observable<Goal> {
        this.goalUrl = this.baseUrl;
        return this.http.get<Goal>(this.goalUrl + '/' + id);
    }

    // sets the goalUrl to the serachParam
    private parameterPresent(searchParam: string) {
        return this.goalUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.goalUrl.indexOf(searchParam);
        let end = 0;
        if (this.goalUrl.indexOf('&') !== -1) {
            end = this.goalUrl.indexOf('&', start) + 1;
        } else {
            end = this.goalUrl.indexOf('&', start);
        }
        this.goalUrl = this.goalUrl.substring(0, start) + this.goalUrl.substring(end);
    }

    //Adds a new goal to the Goal[]
    addNewGoal(newGoal: Goal): Observable<{'$oid': string}> {
        this.goalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };
        // Send post request to add a new goal with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.goalUrl + '/new', newGoal, httpOptions);
    }

    //Edits the specified goal with the given fields
    editGoal(editedGoal: Goal): Observable<{'$oid': string}> {
        this.goalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.goalUrl + '/edit', editedGoal, httpOptions);
    }

    //Removes the specified goal from the server
    deleteGoal(goaldID: String) {
        this.goalUrl = this.baseUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.delete(this.goalUrl + '/delete/' + goaldID, httpOptions);
    }

    //Helper Functions//

    //Checks if the goal has a userId, and sets this.noID to true if there isn't an
    //ID associated with the goal
    filterByUserID(userID: string): void {
        if (!(userID == null || userID === '')) {
            if (this.parameterPresent('userID=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('userID=');
            }
            if (this.goalUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.goalUrl += 'userID=' + userID + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.goalUrl += '?userID=' + userID + '&';
            }
        } else {
            // there was no userID
            this.noID = true;
        }
    }
}
