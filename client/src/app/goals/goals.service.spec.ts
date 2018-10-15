import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Goal} from './goal';
import {GoalsService} from './goals.service';
import {AppService} from "../app.service";

describe('Goal list service: ', () => {
    // A small collection of test goals
    const testGoals: Goal[] = [
        {
            _id: 'food_id',
            userID: 'userID1',
            purpose: 'Gain some weight',
            category: 'Food',
            name: 'Eat all the cookies',
            status: false,
            start: "2018-04-05T18:56:24.702Z",
            end: "2019-07-05T18:56:24.702Z",
            next: "2018-05-05T18:56:24.702Z",
            frequency: "Daily"
        },
        {
            _id: 'chores_id',
            userID: 'userID2',
            purpose: 'Have cleaner kitchen',
            category: 'Chores',
            name: 'Take out recycling',
            status: true,
            start: "2017-05-07T18:56:24.702Z",
            end: "2019-05-05T18:56:24.702Z",
            next: "2018-05-12T18:56:24.702Z",
            frequency: "Daily"
        },
        {
            _id: 'family_id',
            userID: 'userID3',
            purpose: 'To love her',
            category: 'Family',
            name: 'Call mom',
            status: true,
            start: "2018-04-05T18:56:24.702Z",
            end: "2017-08-10T18:56:24.702Z",
            next: "2017-05-05T18:56:24.702Z",
            frequency: "Daily"
        }
    ];
    const mGoals: Goal[] = testGoals.filter(goal =>
        goal.category.toLowerCase().indexOf('m') !== -1
    );

    let appService: AppService;
    let goalListService: GoalsService;
    let currentlyImpossibleToGenerateSearchGoalUrl: string;

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
        goalListService = new GoalsService(httpClient);
        appService = new AppService();
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    // Checks if the correct goals are returned
    it('getGoals() calls api/goals', () => {

        const testGoal: Goal[] = [
            {
                _id: 'food_id',
                userID: 'userID1',
                purpose: 'Gain some weight',
                category: 'Food',
                name: 'Eat all the cookies',
                status: false,
                start: "2018-04-05T18:56:24.702Z",
                end: "2018-05-05T18:56:24.702Z",
                next: "2018-05-05T18:56:24.702Z",
                frequency: "Daily"
            }];

        goalListService.getGoals('userID1').subscribe(
            goals => expect(goals).toBe(testGoal)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(goalListService.baseUrl + '?userID=userID1&');
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testGoal);

    });

    //Checks if adding a new goal works
    it('adding a goal calls api/goals/new', () => {
        const chores_id = { '$oid': 'chores_id' };
        const newGoal: Goal = {
            _id: 'chores_id',
            userID: 'userID1',
            purpose: 'Have cleaner bathroom',
            category: 'Chores',
            name: 'Plunge toilet',
            status: false,
            start: "2018-04-05T18:56:24.702Z",
            end: "2018-05-15T18:56:24.702Z",
            next: "2018-05-12T18:56:24.702Z",
            frequency: "Daily"
        };

        goalListService.addNewGoal(newGoal).subscribe(
            id => {
                expect(id).toBe(chores_id);
            }
        );

        const expectedUrl: string = goalListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(chores_id);
    });

    //Checks if completing a goal works
    it('completing a goal calls api/goals/edit', () => {
        const family_id = { '$oid': 'family_id' };
        const completeGoal: Goal = {
            _id: 'family_id',
            userID: 'userID1',
            purpose: 'Talk about my classes',
            category: 'Family',
            name: 'Call sister',
            status: true,
            start: "2018-04-05T18:56:24.702Z",
            end: "2018-05-29T18:56:24.702Z",
            next: "2018-05-18T18:56:24.702Z",
            frequency: "Daily"
        };

        goalListService.editGoal(completeGoal).subscribe(
            id => {
                expect(id).toBe(family_id);
            }
        );

        const expectedUrl: string = goalListService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(family_id);
    });

});

