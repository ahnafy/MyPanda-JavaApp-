import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';

@Injectable()
export class SettingsService {
    readonly baseUrl: string = environment.API_URL;
    private currentUrl: string = this.baseUrl;
    private noID: boolean = false;
    private empty: Observable<string> = Observable.of("");

    constructor(private http: HttpClient) {
    }

    editStyle(userID: string, setting?: string): Observable<string> {
        this.currentUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);

        //require a userID
        if(this.noID){
            return this.empty;
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        var object = {
            userID: userID,
            setting: setting
        }

        return this.http.post<string>(this.currentUrl + "user/style/edit", object, httpOptions);
        //return this.http.post<string>(this.currentUrl + "user/style/edit?" + "userID=" + userID + "&StyleSetting=" + setting, httpOptions);
    }

    editFont(userID: string, setting?: string): Observable<string> {
        this.currentUrl = this.baseUrl;
        this.noID = false;

        this.filterByUserID(userID);
        console.log("editFont()");
        //require a userID
        if(this.noID){
            console.log("editFont() returned empty");
            return this.empty;
        }
        console.log("editFont() seems good");
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        var object = {
            userID: userID,
            setting: setting
        }

        return this.http.post<string>(this.currentUrl + "user/font/edit", object, httpOptions);

        //return this.http.post<string>(this.currentUrl + "user/font/edit?" + "userID=" + userID + "&FontSetting=" + setting, httpOptions);
    }

    filterByUserID(userID: string): void {
        if (userID == null || userID === '') {
            // there was no userID
            this.noID = true;
        }
    }
}
