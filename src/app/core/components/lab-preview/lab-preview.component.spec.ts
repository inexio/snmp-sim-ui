import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LabPreviewComponent } from "./lab-preview.component";

describe("LabPreviewComponent", () => {
    let component: LabPreviewComponent;
    let fixture: ComponentFixture<LabPreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LabPreviewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LabPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
