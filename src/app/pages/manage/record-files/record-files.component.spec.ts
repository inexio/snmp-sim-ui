import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RecordFilesComponent } from "./record-files.component";

describe("RecordFilesComponent", () => {
    let component: RecordFilesComponent;
    let fixture: ComponentFixture<RecordFilesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecordFilesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordFilesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
