import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EndpointPreviewComponent } from "./endpoint-preview.component";

describe("EndpointPreviewComponent", () => {
    let component: EndpointPreviewComponent;
    let fixture: ComponentFixture<EndpointPreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EndpointPreviewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EndpointPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
