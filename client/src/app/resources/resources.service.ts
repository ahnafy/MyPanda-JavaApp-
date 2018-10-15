import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Link} from './link';
import {Contact} from './contact';
import {environment} from '../../environments/environment';
import 'rxjs/add/observable/of';


@Injectable()
export class ResourcesService {
    readonly baseLinkUrl: string = environment.API_URL + 'links';
    readonly baseContactUrl: string = environment.API_URL + 'contacts';
    private requestUrl: string;
    private noID: boolean = false;
    private emptyLinkObservable: Observable<Link[]> = Observable.of([]);
    private emptyContactObservable: Observable<Contact[]> = Observable.of([]);

    constructor(private http: HttpClient) {
    }

    //Get links from the server
    getLinks(userID: string): Observable<Link[]> {
        this.requestUrl = this.baseLinkUrl;
        this.noID = false;

        this.filterByUserID(userID);

        //require a userID
        if(this.noID){
            return this.emptyLinkObservable;
        }
        console.log(this.requestUrl);
        return this.http.get<Link[]>(this.requestUrl);
    }

    //Get contacts from the server
    getContacts(userID: string): Observable<Contact[]> {
        this.requestUrl = this.baseContactUrl;
        this.noID = false;

        this.filterByUserID(userID);

        //require a userID
        if(this.noID){
            return this.emptyContactObservable;
        }
        console.log(this.requestUrl);
        return this.http.get<Contact[]>(this.requestUrl);
    }

    // sets the requestUrl to the serachParam
    private parameterPresent(searchParam: string) {
        return this.requestUrl.indexOf(searchParam) !== -1;
    }

    // remove the parameter and, if present, the &
    private removeParameter(searchParam: string) {
        const start = this.requestUrl.indexOf(searchParam);
        let end = 0;
        if (this.requestUrl.indexOf('&') !== -1) {
            end = this.requestUrl.indexOf('&', start) + 1;
        } else {
            end = this.requestUrl.indexOf('&', start);
        }
        this.requestUrl = this.requestUrl.substring(0, start) + this.requestUrl.substring(end);
    }

    //Adds a new link to the Link[]
    addNewLink(newLink: Link): Observable<{'$oid': string}> {
        this.requestUrl = this.baseLinkUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };
        // Send post request to add a new resource with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.requestUrl + '/new', newLink, httpOptions);
    }

    //Adds a new Contact to the Contact[]
    addNewContact(newContact: Contact): Observable<{'$oid': string}> {
        this.requestUrl = this.baseContactUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };
        // Send post request to add a new resource with the user data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.requestUrl + '/new', newContact, httpOptions);
    }

    //Edits the specified contact with the given fields
    editLink(editedLink: Link): Observable<{'$oid': string}> {
        this.requestUrl = this.baseLinkUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.requestUrl + '/edit', editedLink, httpOptions);
    }

    //Edits the specified contact with the given fields
    editContact(editedContact: Contact): Observable<{'$oid': string}> {
        this.requestUrl = this.baseContactUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.post<{'$oid': string}>(this.requestUrl + '/edit', editedContact, httpOptions);
    }

    //Removes the specified contact from the server
    deleteContact(contactID: String) {
        this.requestUrl = this.baseContactUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.delete(this.requestUrl + '/delete/' + contactID, httpOptions);
    }

    //Removes the specified link from the server
    deleteLink(linkID: String) {
        this.requestUrl = this.baseLinkUrl;
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
        };

        // Send post request to add a new journal with the journal data as the body with specified headers.
        return this.http.delete(this.requestUrl + '/delete/' + linkID, httpOptions);
    }

    //Helper Functions//

    //Checks if the resource has a userId, and sets this.noID to true if there isn't an
    //ID associated with the resource
    filterByUserID(userID: string): void {
        if (!(userID == null || userID === '')) {
            if (this.parameterPresent('userID=') ) {
                // there was a previous search by category that we need to clear
                this.removeParameter('userID=');
            }
            if (this.requestUrl.indexOf('?') !== -1) {
                // there was already some information passed in this url
                this.requestUrl += 'userID=' + userID + '&';
            } else {
                // this was the first bit of information to pass in the url
                this.requestUrl += '?userID=' + userID + '&';
            }
        } else {
            // there was no userID
            this.noID = true;
        }
    }
}
