import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AgentPreviewComponent } from "./agent-preview.component";

describe("AgentPreviewComponent", () => {
    let component: AgentPreviewComponent;
    let fixture: ComponentFixture<AgentPreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AgentPreviewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AgentPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
