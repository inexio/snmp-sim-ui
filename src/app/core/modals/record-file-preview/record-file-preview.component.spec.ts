import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RecordFilePreviewComponent } from "./record-file-preview.component";

describe("RecordFilePreviewComponent", () => {
    let component: RecordFilePreviewComponent;
    let fixture: ComponentFixture<RecordFilePreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecordFilePreviewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecordFilePreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
