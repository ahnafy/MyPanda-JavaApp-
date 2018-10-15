import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {AddLinkComponent} from './add-link.component';
import {CustomModule} from "../../../custom.module";

describe ('Add youtube link component', () => {

    let addContactComponent: AddLinkComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<AddLinkComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [AddLinkComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockMatDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: null },
                { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }]
        }).compileComponents().catch(error => {
            expect(error).toBeNull();
        });
    }));

    beforeEach(() => {
        calledClose = false;
        fixture = TestBed.createComponent(AddLinkComponent);
        addContactComponent = fixture.componentInstance;
    });

    it('closes properly', () => {
        addContactComponent.onNoClick();
        expect(calledClose).toBe(true);
    });
});
