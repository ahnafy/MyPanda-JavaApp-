import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Emotion} from './emotion';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';


@Injectable()
export class EmotionService {
    readonly baseUrl: string = environment.API_URL + 'emotions';
    private emotionUrl: string = this.baseUrl;
    private noID: boolean = false;
    private emptyObservable: Observable<{'$oid': string}> = Observable.of({'$oid': ""});

    constructor(private http: HttpClient) {
    }

    addNewEmotion(newEmotion: Emotion): Observable<{'$oid': string}> {
        this.emotionUrl = this.baseUrl;
        this.noID = false;

        if(newEmotion.userID == null || newEmotion.userID == ""){
            this.noID = true;
        }

        if(newEmotion.description == null) {
            newEmotion.description = '';
        }

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        console.log(this.http.post<{'$oid': string}>(this.emotionUrl + '/new', newEmotion, httpOptions));

        if(this. noID){
            return this.emptyObservable;
        }
        // This function sends a post request to add a new emotion with the emotion data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.emotionUrl + '/new', newEmotion, httpOptions);
    }
}
