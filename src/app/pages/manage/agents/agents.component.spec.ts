import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AgentsComponent } from "./agents.component";

describe("AgentsComponent", () => {
    let component: AgentsComponent;
    let fixture: ComponentFixture<AgentsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AgentsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AgentsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
