import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {Journal} from './journal';
import {JournalsService} from './journals.service';

describe('Journal list service: ', () => {
    // A small collection of test journals
    const testJournals: Journal[] = [
        {
            _id: 'buying_id',
            userID: 'weare1',
            title: 'Buying food',
            content: 'I went to the ice cream store today for a sundae.',
            date: "Sat Jan 27 13:36:47 CST 2018"
        },
        {
            _id: 'visit_id',
            userID: 'usermcuserface',
            title: 'Visit mom',
            content: 'I went to my Mom\'s house to talk to her.',
            date: "Sun Feb 12 16:32:41 CST 2018"
        },
        {
            _id: 'running_id',
            userID: 'theguyoverthere',
            title: 'Go on amazing run',
            content: 'I went on a 25 mile run today!',
            date: "Mon Mar 11 19:26:37 CST 2018"
        }
    ];

    let journalListService: JournalsService;
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
        journalListService = new JournalsService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getJournals() calls api/journals', () => {

        const testJournal: Journal[] = [
            {
                _id: 'buying_id',
                userID: 'weare1',
                title: 'Buying food',
                content: 'I went to the ice cream store today for a sundae.',
                date: "Sat Jan 27 13:36:47 CST 2018"
            }
        ];
        journalListService.getJournals('weare1').subscribe(
            resultjournals => expect(resultjournals).toBe(testJournal)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(journalListService.baseUrl + '?userID=weare1&');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testJournal);
    });

    it('filterByTitle(journalTitle) deals appropriately with a URL that already had a title', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?title=f&something=k&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterByTitle('m');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '?something=k&title=m&');
    });

    it('filterByTitle(journalTitle) deals appropriately with a URL that already had some filtering, but no title', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?something=k&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterByTitle('m');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '?something=k&title=m&');
    });

    it('filterByTitle(journalTitle) deals appropriately with a URL has the keyword title, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?title=&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterByTitle('');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '');
    });


    it('getJournalByID() calls api/journals/id', () => {
        const targetJournal: Journal = testJournals[1];
        const targetId: string = targetJournal._id;
        journalListService.getJournalById(targetId).subscribe(
            journal => expect(journal).toBe(targetJournal)
        );

        const expectedUrl: string = journalListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetJournal);
    });

    it('adding a journal calls api/journals/new', () => {
        const plunging_id = { '$oid': 'plunging_id' };
        const newJournal: Journal = {
            _id: 'plunging_id',
            userID: 'userID99',
            title: 'Bathroom duties today',
            content: 'Incidents occurred, so the toilet was plunged asap.',
            date: "Mon Mar 11 19:26:37 CST 2018"
        };

        journalListService.addNewJournal(newJournal).subscribe(
            id => {
                expect(id).toBe(plunging_id);
            }
        );

        const expectedUrl: string = journalListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(plunging_id);
    });

    it('editing a journal calls api/journals/edit', () => {
        const washing_id = { '$oid': 'washing_id' };
        const editJournal: Journal = {
            _id: 'washing_id',
            userID: 'userID1',
            title: 'After cleaning today',
            content: 'My hands got a little dirty doing chores, so I washed them.',
            date: "Sat Feb 21 19:16:37 CST 2018"
        };

        journalListService.editJournal(editJournal).subscribe(
            id => {
                expect(id).toBe(washing_id);
            }
        );

        const expectedUrl: string = journalListService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(washing_id);
    });

    it('deleting a journal calls api/journals/delete', () => {
        //const cleaning_id = { '$oid': 'cleaning_id' };
        const cleaning_id: string = "cleaning_id";

        journalListService.deleteJournal(cleaning_id).subscribe(
            id => {
                expect(id).toBe(cleaning_id);
            }
        );

        const expectedUrl: string = journalListService.baseUrl + '/delete/' + cleaning_id;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('DELETE');
        req.flush(cleaning_id);
    });

});
