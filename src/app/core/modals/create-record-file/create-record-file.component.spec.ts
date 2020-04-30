import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateRecordFileComponent } from "./create-record-file.component";

describe("CreateRecordFileComponent", () => {
    let component: CreateRecordFileComponent;
    let fixture: ComponentFixture<CreateRecordFileComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateRecordFileComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateRecordFileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
