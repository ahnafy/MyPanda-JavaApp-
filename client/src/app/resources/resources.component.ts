import {AppService} from "../app.service";
import {Component, OnInit} from '@angular/core';
import {Contact} from './contact';
import {Link} from './link';
import {ResourcesService} from "./resources.service";
import {AddLinkComponent} from "./add/links/add-link.component";
import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {MatSnackBar} from '@angular/material';
import {AddContactComponent} from "./add/contacts/add-contact.component";
import {Router} from "@angular/router";


@Component({
    selector: 'resources-component',
    templateUrl: 'resources.component.html',
    styleUrls: ['./resources.component.scss'],
    providers: [AppService]
})
export class ResourcesComponent implements OnInit{
    videoTitle; linkTitle; numberTitle: string;

    links: Link[] = [];
    contacts: Contact[] = [];
    typeOfResource = 'contacts';

    constructor(public appService: AppService,
                public resourcesService: ResourcesService,
                public dialog: MatDialog,
                public router: Router,
                public snackBar: MatSnackBar) {

        this.videoTitle = 'Videos';
        this.linkTitle = 'Links';
        this.numberTitle = 'Phone Numbers';
    }

    private highlightedID: { '$oid': string } = {'$oid': ''};

    defaultLinks: Link[] = [
        {
            _id: 'default',
            name: 'Depression Help',
            subname:'',
            userID:'',
            url: 'https://depression.org.nz/get-better/self-help/'
        },        {
            _id: 'default',
            name: 'Coping With Depression',
            subname:'',
            userID:'',
            url: 'https://www.helpguide.org/articles/depression/coping-with-depression.htm'
        },        {
            _id: 'default',
            name: 'Manage Anxiety and Stress',
            subname:'',
            userID:'',
            url: 'https://adaa.org/tips-manage-anxiety-and-stress'
        },        {
            _id: 'default',
            name: 'Anxiety Help',
            subname:'',
            userID:'',
            url: 'https://www.calmclinic.com/anxiety-guide/help-options'
        },        {
            _id: 'default',
            name: 'Anger Management: 10 tips',
            subname:'',
            userID:'',
            url: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/anger-management/art-20045434'
        },        {
            _id: 'default',
            name: 'General Anger Mangement',
            subname:'',
            userID:'',
            url: 'https://www.mindtools.com/pages/article/newTCS_97.htm'
        },
    ]
    // This opens up the Link dialog specific to the person's userID
    newLinkDialog(): void {
        const newLink: Link = {
            _id: '',
            userID: localStorage.getItem("userID"),
            name: '',
            subname: '',
            url: '',
        };
        const dialogRef = this.dialog.open(AddLinkComponent, {
            width: '300px',
            data: {link: newLink}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a link");
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.resourcesService.addNewLink(result).subscribe(
                        addLinkResult => {
                            this.highlightedID = addLinkResult;
                            this.refreshLinks();
                            this.snackBar.open("Link Created", "CLOSE", {
                                duration: 3000,
                            });
                        },
                        err => {
                            // This should probably be turned into some sort of meaningful response.
                            console.log('There was an error adding the link.');
                            console.log('The error was ' + JSON.stringify(err));
                        });
                }
            }
        });
    }
    // This opens up the new Contact dialog specific to your userID
    newContactDialog(): void {
        const newContact: Contact = {
            _id: '',
            userID: localStorage.getItem("userID"),
            name: '',
            email: '',
            phone: '',
        };
        const dialogRef = this.dialog.open(AddContactComponent, {
            width: '300px',
            data: {contact: newContact}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == undefined) {
                console.log("Cancelled without adding a contact");
            }
            else {
                if(localStorage.isSignedIn == "true"){
                    this.resourcesService.addNewContact(result).subscribe(
                        addContactResult => {
                            this.highlightedID = addContactResult;

                            this.refreshContacts();

                            this.snackBar.open("Contact Created", "CLOSE", {
                                duration: 3000,
                            });
                        },
                        err => {
                            // This should probably be turned into some sort of meaningful response.
                            console.log('There was an error adding the contact.');
                            console.log('The error was ' + JSON.stringify(err));
                        });
                }
            }
        });
    }
    // This adds the delete contact functionality to the contact collection
    deleteContact(_id: string) {
        this.resourcesService.deleteContact(_id).subscribe(
            contacts => {
                console.log("first part");
                this.refreshContacts();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshContacts();
                this.loadService();
                this.snackBar.open("Contact Deleted", "CLOSE", {
                    duration: 3000,
                });
            }
        );
    }
    // This adds the delete link functionality to the link collection
    deleteLink(_id: string) {
        this.resourcesService.deleteLink(_id).subscribe(
            links => {
                console.log("first part");
                this.refreshLinks();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshLinks();
                this.loadService();
                this.snackBar.open("YouTube Video Deleted", "CLOSE", {
                    duration: 3000,
                });
            }
        );
    }
    // This function refreshes the link component in the resources page
    refreshLinks(): Observable<Link[]> {
        const linkObservable: Observable<Link[]> = this.resourcesService.getLinks(localStorage.getItem("userID"));

        console.log(linkObservable);
        linkObservable.subscribe(
            links => {
                console.log(links);
                if(links != null){
                    this.links = links;
                }
            },
            err => {
                console.log(err);
            });
        return linkObservable;
    }
    // This function refreshes the contact component in the resources page
    refreshContacts(): Observable<Contact[]> {

        const contactObservable: Observable<Contact[]> = this.resourcesService.getContacts(localStorage.getItem("userID"));

        console.log(contactObservable);
        contactObservable.subscribe(
            contacts => {
                console.log(contacts);
                if(contacts != null){
                    this.contacts = contacts;
                }
            },
            err => {
                console.log(err);
            });
        return contactObservable;
    }

    loadService(): void {
        console.log(localStorage.getItem("userID"));
        this.resourcesService.getLinks(localStorage.getItem("userID")).subscribe(
            links => {
                this.links = links;
            },
            err => {
                console.log(err);
            }
        );

        this.resourcesService.getContacts(localStorage.getItem("userID")).subscribe(
            links => {
                this.contacts = links;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        //For testing
        //toggle the value in app service to toggle testing
        this.appService.testingToggle();

        if (!this.appService.isSignedIn()) {
            this.router.navigate(['']);
        }

        this.refreshLinks();
        this.refreshContacts();
        this.loadService();
    }

}
