import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EnginePreviewComponent } from "./engine-preview.component";

describe("EnginePreviewComponent", () => {
    let component: EnginePreviewComponent;
    let fixture: ComponentFixture<EnginePreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EnginePreviewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EnginePreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
