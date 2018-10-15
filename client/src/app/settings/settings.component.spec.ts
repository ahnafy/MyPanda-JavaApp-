import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {SettingsComponent} from "./settings.component";
import {SettingsService} from "./settings.service";
import {HttpClient} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Observable} from 'rxjs/Observable';
import {CustomModule} from '../custom.module';
import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {RouterTestingModule} from "@angular/router/testing";

describe( 'SaveSettings() functions', () => {

    let settingsComponent: SettingsComponent;
    let settingsService: SettingsService;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let fixture: ComponentFixture<SettingsComponent>;

    let settingsServiceStub: {
        editStyle: () => Observable<String>,
        editFont: () => Observable<String>
    };


    beforeEach(() => {
        // stub for test reasons
        settingsServiceStub = {
            editStyle: () => Observable.of("test-setting"),
            editFont: () => Observable.of("test-setting")
        };

        TestBed.configureTestingModule({
            imports: [CustomModule, RouterTestingModule, HttpClientTestingModule],
            declarations: [SettingsComponent],
            providers: [{provide: SettingsService, useValue: settingsServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);

        settingsService = new SettingsService(httpClient);
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(SettingsComponent);
            settingsComponent = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    //General Tests
    it('changes the settings for font and theme', () => {

        localStorage.setItem("fontSelected", "not-test-setting");
        localStorage.setItem("styleSelected", "not-test-setting");

        settingsComponent.saveSettings();

        expect(localStorage.getItem("fontSelected")).toBe("not-test-setting");
        expect(localStorage.getItem("styleSelected")).toBe("not-test-setting");
    });

});
