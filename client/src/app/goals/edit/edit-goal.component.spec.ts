import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef, MAT_DIALOG_DATA, MATERIAL_COMPATIBILITY_MODE} from '@angular/material';
import {EditGoalComponent} from './edit-goal.component';
import {CustomModule} from '../../custom.module';

describe('Edit goal component', () => {

    let editGoalComponent: EditGoalComponent;
    let calledClose: boolean;
    const mockMatDialogRef = {
        close() { calledClose = true; }
    };
    let fixture: ComponentFixture<EditGoalComponent>;

    beforeEach(async( () => {
        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [EditGoalComponent],
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
        fixture = TestBed.createComponent(EditGoalComponent);
        editGoalComponent = fixture.componentInstance;
    });

    it('closes properly', () => {
        editGoalComponent.onNoClick();
        expect(calledClose).toBe(true);
    });
});
