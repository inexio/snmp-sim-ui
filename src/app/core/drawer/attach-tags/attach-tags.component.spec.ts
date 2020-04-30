import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AttachTagsComponent } from "./attach-tags.component";

describe("AttachTagsComponent", () => {
    let component: AttachTagsComponent;
    let fixture: ComponentFixture<AttachTagsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttachTagsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttachTagsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
