import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Summary} from "./summary";
import {SummaryListService} from "./summary-list.service";
import {SummaryListComponent} from "./summary-list.component";

describe('Summary: ', () => {
    // A small collection of test summaries

    const testSummaries: Summary[] = [
        {
            _id: '1',
            userID: 'userID1',
            emotion: 'happy',
            date: '03/13/2018',
            intensity: 2,
            description: 'slept',
        },
        {
            _id: '2',
            userID: 'userID1',
            emotion: 'sad',
            date: '03/14/2018',
            intensity: 4,
            description: 'friend died',
        },
        {
            _id: '3',
            userID: 'userID1',
            emotion: 'mad',
            date: '03/15/2018',
            intensity: 5,
            description: 'didnt sleep',
        },
    ];
    const mSummaries: Summary[] = testSummaries.filter(summary =>
        summary.emotion.toLowerCase().indexOf('a') !== 3
    );

    // We will need some url information from the summaryService to meaningfully test category filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let summaryService: SummaryListService;
    let currentlyImpossibleToGenerateSearchSummaryUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
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
        summaryService = new SummaryListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getSummaries() calls api/summaries', () => {

        const testSummary: Summary[] = [
            {
                _id: '1',
                userID: 'userID1',
                emotion: 'happy',
                date: '03/13/2018',
                intensity: 2,
                description: 'slept',
            }
        ];

        summaryService.getSummaries('userID1').subscribe(
            summaries => expect(summaries).toBe(testSummary)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(summaryService.baseUrl + '?userID=userID1&');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testSummary);
    });

    it('getSummaries(summaryCategory) adds appropriate param string to called URL', () => {
        summaryService.getSummaries('userID1','a').subscribe(
            summaries => expect(summaries).toEqual(mSummaries)
        );

        const req = httpTestingController.expectOne(summaryService.baseUrl + '?userID=userID1&' + 'emotion=a&');
        expect(req.request.method).toEqual('GET');
        req.flush(mSummaries);
    });

    it('filterByEmotion(summaryEmotion) deals appropriately with a URL that already had a emotion', () => {
        currentlyImpossibleToGenerateSearchSummaryUrl = summaryService.baseUrl + '?emotion=m&something=k&';
        summaryService['summaryUrl'] = currentlyImpossibleToGenerateSearchSummaryUrl;
        summaryService.filterByEmotion('a');
        expect(summaryService['summaryUrl']).toEqual(summaryService.baseUrl + '?something=k&emotion=a&');
    });

    it('filterByEmotion()terByEmotion()) deals appropriately with a URL that already had some filtering, but no emotion', () => {
        currentlyImpossibleToGenerateSearchSummaryUrl = summaryService.baseUrl + '?something=k&';
        summaryService['summaryUrl'] = currentlyImpossibleToGenerateSearchSummaryUrl;
        summaryService.filterByEmotion('m');
        expect(summaryService['summaryUrl']).toEqual(summaryService.baseUrl + '?something=k&emotion=m&');
    });

    it('filterByEmotion()terByEmotion()) deals appropriately with a URL has the keyword Emotion, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchSummaryUrl = summaryService.baseUrl + '?emotion=&';
        summaryService['summaryUrl'] = currentlyImpossibleToGenerateSearchSummaryUrl;
        summaryService.filterByEmotion('');
        expect(summaryService['summaryUrl']).toEqual(summaryService.baseUrl + '');
    });
});
