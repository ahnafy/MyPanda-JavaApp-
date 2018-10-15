import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {EditLinkComponent} from "./edit-links.component";
import {CustomModule} from "../../../custom.module";


describe('Edit link component', () => {

    let editLinkComponent: EditLinkComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<EditLinkComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [EditLinkComponent],
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
        fixture = TestBed.createComponent(EditLinkComponent);
        editLinkComponent = fixture.componentInstance;
    });

    it('closes properly', () => {
        editLinkComponent.onNoClick();
        expect(calledClose).toBe(true);
    });
});
