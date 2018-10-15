import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {Link} from './link';
import {Contact} from './contact';
import {ResourcesService} from './resources.service';

describe('Resource list service: ', () => {
    // A small collection of test journals
    const testLinks: Link[] = [
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
    ];

    const testContacts: Contact[] = [
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
    ];

    let resourceListService: ResourcesService;
    let currentlyImpossibleToGenerateSearchJournalUrl: string;

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        resourceListService = new ResourcesService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getLinks() calls api/links', () => {

        const testLink: Link[] = [
            {
                _id: 'running_id',
                userID: 'userID3',
                name: 'Go on run',
                subname: 'I went on a 25 mile run today!',
                url: "runWithMe.life"
            }
        ];
        resourceListService.getLinks('running_id').subscribe(
            resultlinks => expect(resultlinks).toBe(testLink)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(resourceListService.baseLinkUrl + '?userID=running_id&');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testLink);
    });

    it('getContacts() calls api/contacts', () => {

        const testContact: Contact[] = [
            {
                _id: 'buying_id',
                userID: 'userID1',
                name: 'Buying food',
                email: 'food@food.com',
                phone: "555-555-5555"
            }
        ];
        resourceListService.getContacts('buying_id').subscribe(
            resultContacts => expect(resultContacts).toBe(testContact)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(resourceListService.baseContactUrl + '?userID=buying_id&');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testContact);
    });

    it('adding a link calls api/resources/new', () => {
        const plunging_id = { '$oid': 'plunging_id' };
        const newLink: Link = {
            _id: 'plunging_id',
            userID: 'userID99',
            name: 'Bathroom duties today',
            subname: 'Incidents occurred, so the toilet was plunged asap.',
            url: "bathroom.com"
        };

        resourceListService.addNewLink(newLink).subscribe(
            id => {
                expect(id).toBe(plunging_id);
            }
        );

        const expectedUrl: string = resourceListService.baseLinkUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(plunging_id);
    });

    it('adding a contact calls api/resources/new', () => {
        const plunging_id = { '$oid': 'plunging_id' };
        const newContact: Contact = {
            _id: 'plunging_id',
            userID: 'userID99',
            name: 'Bathroom duties today',
            email: 'hi@hello.com',
            phone: "999-999-9999"
        };

        resourceListService.addNewContact(newContact).subscribe(
            id => {
                expect(id).toBe(plunging_id);
            }
        );

        const expectedUrl: string = resourceListService.baseContactUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(plunging_id);
    });

    it('editing a link calls api/resources/edit', () => {
        const washing_id = { '$oid': 'washing_id' };
        const editLink: Link = {
            _id: 'washing_id',
            userID: 'userID1',
            name: 'After cleaning today',
            subname: 'My hands got a little dirty doing chores, so I washed them.',
            url: "cleaning.org"
        };

        resourceListService.editLink(editLink).subscribe(
            id => {
                expect(id).toBe(washing_id);
            }
        );

        const expectedUrl: string = resourceListService.baseLinkUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(washing_id);
    });

    it('editing a contact calls api/resources/edit', () => {
        const washing_id = { '$oid': 'washing_id' };
        const editContact: Contact = {
            _id: 'washing_id',
            userID: 'userID1',
            name: 'After cleaning today',
            email: 'hi@hello.com',
            phone: "222-222-2222"
        };

        resourceListService.editContact(editContact).subscribe(
            id => {
                expect(id).toBe(washing_id);
            }
        );

        const expectedUrl: string = resourceListService.baseContactUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(washing_id);
    });

    it('deleting a link calls api/resources/delete', () => {
        //const cleaning_id = { '$oid': 'cleaning_id' };
        const cleaning_id: string = "cleaning_id";

        resourceListService.deleteLink(cleaning_id).subscribe(
            id => {
                expect(id).toBe(cleaning_id);
            }
        );

        const expectedUrl: string = resourceListService.baseLinkUrl + '/delete/' + cleaning_id;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('DELETE');
        req.flush(cleaning_id);
    });

    it('deleting a contact calls api/resources/delete', () => {
        //const cleaning_id = { '$oid': 'cleaning_id' };
        const cleaning_id: string = "cleaning_id";

        resourceListService.deleteContact(cleaning_id).subscribe(
            id => {
                expect(id).toBe(cleaning_id);
            }
        );

        const expectedUrl: string = resourceListService.baseContactUrl + '/delete/' + cleaning_id;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('DELETE');
        req.flush(cleaning_id);
    });
});
