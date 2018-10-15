import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {SettingsService} from './settings.service';

describe('Setting list service: ', () => {

    //set of users
    const testUsers = [
        {
            "_id": "5ae923bac4846cea2d42cc62",
            "SubjectID": "5ae923baee4677f2023bbc0f",
            "FirstName": "Elvia ",
            "LastName": "Wallace",
            "StyleSetting": "default-style",
            "FontSetting": "default-font"
        },
        {
            "_id": "5ae923ba73a4d6eb893eef00",
            "SubjectID": "5ae923babdbc1fec041bfbe5",
            "FirstName": "Lelia ",
            "LastName": "Mcneil",
            "StyleSetting": "default-style",
            "FontSetting": "default-font"
        },
        {
            "_id": "5ae923ba3b7a8e691b77b0cb",
            "SubjectID": "5ae923ba6ea93dc3c2fec985",
            "FirstName": "Maggie ",
            "LastName": "Barton",
            "StyleSetting": "default-style",
            "FontSetting": "default-font"
        }]

    let settingsService: SettingsService;
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
        settingsService = new SettingsService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('editStyle() calls correct api route', () => {

        var fake_setting: string = "fake-setting";

        settingsService.editStyle('5ae923ba3b7a8e691b77b0cb', fake_setting).subscribe(
            result => expect(result).toBe("fake-setting")
        );


        const expectedUrl: string = settingsService.baseUrl + 'user/style/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(fake_setting);
    });


    it('editFont() calls correct api route', () => {

        var fake_setting: string = "fake-setting";

        settingsService.editFont('5ae923ba3b7a8e691b77b0cb', fake_setting).subscribe(
            result => expect(result).toBe("fake-setting")
        );


        const expectedUrl: string = settingsService.baseUrl + 'user/font/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(fake_setting);
    });


});
