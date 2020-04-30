import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UserKeysComponent } from "./user-keys.component";

describe("UserKeysComponent", () => {
  let component: UserKeysComponent;
  let fixture: ComponentFixture<UserKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserKeysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
