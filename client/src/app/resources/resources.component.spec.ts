import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Contact} from './contact';
import {Link} from './link';
import {ResourcesComponent} from './resources.component';
import {ResourcesService} from './resources.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';
import {ArraySortPipe} from "../journals/array-sort.pipe";
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {MatDialog} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";

describe( 'Resources', () => {

    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;

    let linkServiceStub: {
        getLinks: () => Observable<Link[]>,
        getContacts: () => Observable<Contact[]>
    };

    let contactServiceStub: {

    };

    beforeEach(() => {
        // stub GoalsService for test reasons
        linkServiceStub = {
            getLinks: () => Observable.of([
                {
                    _id: 'buying_id',
                    userID: 'userID1',
                    name: 'Buying food',
                    subname: 'I went to the ice cream store today for a sundae.',
                    url: "buyfood.com"
                },
                {
                    _id: 'visit_id',
                    userID: 'userID2',
                    name: 'Visit mom',
                    subname: 'I went to my Mom\'s house to talk to her.',
                    url: "visitMom.org"
                },
                {
                    _id: 'running_id',
                    userID: 'userID3',
                    name: 'Go on run',
                    subname: 'I went on a 25 mile run today!',
                    url: "runWithMe.life"
                }
            ]),

            getContacts: () => Observable.of([
                {
                    _id: 'buying_id',
                    userID: 'userID1',
                    name: 'Buying food',
                    email: 'food@food.com',
                    phone: "555-555-5555"
                },
                {
                    _id: 'visit_id',
                    userID: 'userID2',
                    name: 'Visit mom',
                    email: 'email@email.com',
                    phone: "444-444-4444"
                },
                {
                    _id: 'running_id',
                    userID: 'userID3',
                    name: 'Go on run',
                    email: 'run@run.com',
                    phone: "333-333-3333"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule, RouterTestingModule],
            declarations: [ResourcesComponent, ArraySortPipe],
            providers: [{provide: ResourcesService, useValue: linkServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    //General Tests
    it('contains all the links', () => {
        expect(resourceList.links.length).toBe(3);
    });
    it('contains all the contacts', () => {
        expect(resourceList.contacts.length).toBe(3);
    });

    it('contains a link titled \'Buying food\'', ()=>{
        expect(resourceList.links.some((link: Link) => link.name === 'Buying food')).toBe(true);
    });

    it('contains a contact title \'Visit mom\'',()=>{
        expect(resourceList.contacts.some((contact: Contact) => contact.name === 'Visit mom')).toBe(true);
    });
});

describe('Adding a link', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const newLink: Link =   {
        _id: '',
        userID: 'userID4',
        name: 'To stay awake writing tests',
        subname: 'Drink coffee',
        url: "stayAwake.com"
    };
    const newId = 'coffee_id';

    let calledLink: Link;

    let linkListServiceStub: {
        getLinks: () => Observable<Link[]>,
        getContacts: () => Observable<Contact[]>,
        addNewLink: (newLink: Link) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ResourceListComponent, any) => {
            afterClosed: () => Observable<Link>
        };
    };

    beforeEach(() => {
        calledLink = null;
        // stub JournalsService for test reasons
        linkListServiceStub = {
            getLinks: () => Observable.of([
                {
                    _id: '',
                    userID: 'userID4',
                    name: 'To stay awake writing tests',
                    subname: 'Drink coffee',
                    url: "stayAwake.com"
                }
            ]),

            getContacts: () => Observable.of([
                {
                    _id: 'buying_id',
                    userID: 'userID1',
                    name: 'Buying food',
                    email: 'food@food.com',
                    phone: "555-555-5555"
                }
            ]),

            addNewLink: (linkToAdd: Link) => {
                calledLink = linkToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newLink);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [ResourcesComponent, ArraySortPipe],
            providers: [
                {provide: ResourcesService, useValue: linkListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    it('calls ResourcesService.addNewLink', () => {
        expect(calledLink).toBeNull();
        resourceList.newLinkDialog();
        expect(calledLink).toEqual(newLink);
    });
});

describe('Adding a contact', () => {
    let resourceList: ResourcesComponent;
    let fixture: ComponentFixture<ResourcesComponent>;
    const newContact: Contact =   {
        _id: 'running_id',
        userID: 'userID3',
        name: 'Go on run',
        email: 'run@run.com',
        phone: "333-333-3333"
    };
    const newId = 'coffee_id';

    let calledContact: Contact;

    let contactListServiceStub: {
        getLinks: () => Observable<Link[]>,
        getContacts: () => Observable<Contact[]>,
        addNewContact: (newContact: Contact) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (ResourceListComponent, any) => {
            afterClosed: () => Observable<Contact>
        };
    };

    beforeEach(() => {
        calledContact = null;
        // stub JournalsService for test reasons
        contactListServiceStub = {
            getLinks: () => Observable.of([
                {
                    _id: '',
                    userID: 'userID4',
                    name: 'To stay awake writing tests',
                    subname: 'Drink coffee',
                    url: "stayAwake.com"
                }
            ]),

            getContacts: () => Observable.of([
                {
                    _id: 'buying_id',
                    userID: 'userID1',
                    name: 'Buying food',
                    email: 'food@food.com',
                    phone: "555-555-5555"
                }
            ]),

            addNewContact: (contactToAdd: Contact) => {
                calledContact = contactToAdd;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(newContact);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [ResourcesComponent, ArraySortPipe],
            providers: [
                {provide: ResourcesService, useValue: contactListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(ResourcesComponent);
            resourceList = fixture.componentInstance;
            fixture.detectChanges();
        });
        localStorage.isSignedIn = "true";
    }));

    it('calls ResourcesService.addNewContact', () => {
        expect(calledContact).toBeNull();
        resourceList.newContactDialog();
        expect(calledContact).toEqual(newContact);
    });
});

    /*





/!*

/!*
describe('Editing a journal', () => {
    let journalList: JournalsComponent;
    let fixture: ComponentFixture<JournalsComponent>;
    const editJournal: Journal =   {
        _id: '',
        userID: 'userID5',
        content: 'I fell asleep in class today',
        title: 'Classes',
        date: "Sun Feb 16 17:12:43 CST 2018"
    };
    const newId = 'class_id';

    let calledJournal: Journal;

    let journalListServiceStub: {
        getJournals: () => Observable<Journal[]>,
        editJournal: (newJournal: Journal) => Observable<{'$oid': string}>
    };
    let mockMatDialog: {
        open: (JournalsComponent, any) => {
            afterClosed: () => Observable<Journal>
        };
    };

    beforeEach(() => {
        calledJournal = null;
        // stub JournalsService for test reasons
        journalListServiceStub = {
            getJournals: () => Observable.of([]),
            editJournal: (journalToEdit: Journal) => {
                calledJournal = journalToEdit;
                return Observable.of({
                    '$oid': newId
                });
            }
        };
        mockMatDialog = {
            open: () => {
                return {
                    afterClosed: () => {
                        return Observable.of(editJournal);
                    }
                };
            }
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule, RouterTestingModule],
            declarations: [JournalsComponent, ArraySortPipe],
            providers: [
                {provide: JournalsService, useValue: journalListServiceStub},
                {provide: MatDialog, useValue: mockMatDialog},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(JournalsComponent);
            journalList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it('calls JournalsService.editJournal', () => {
        expect(calledJournal).toBeNull();
        journalList.openEditJournalDialog(this._id, this.title, this.content, this.date);
        expect(calledJournal).toEqual(editJournal);
    });
});
*!/
*/
