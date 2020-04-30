import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserPreviewComponent } from "./user-preview.component";

describe("UserPreviewComponent", () => {
    let component: UserPreviewComponent;
    let fixture: ComponentFixture<UserPreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserPreviewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
