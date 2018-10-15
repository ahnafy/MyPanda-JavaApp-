import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {Emotion} from "./emotion";
import {EmotionService} from "./home.service";

describe('Home list service: ', () => {
    const testHomeSerivce: Emotion[] = [
        {
            _id: 'test1',
            userID: 'tester1',
            emotion: 'happy',
            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
            intensity: 3,
            description: 'im happy',
        },
        {
            _id: 'test2',
            userID: 'tester2',
            emotion: 'anxious',
            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
            intensity: 5,
            description: 'im super anxious',
        },
        {
            _id: 'test3',
            userID: 'tester3',
            emotion: 'meh',
            date: 'Sat Apr 07 2018 15:23:28 GMT-0000 (UTC)',
            intensity: 1,
            description: 'im meh',
        }
    ];

    let homeListService: EmotionService;
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
        homeListService = new EmotionService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

});
