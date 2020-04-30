import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AddEndpointComponent } from "./add-endpoint.component";

describe("AddEndpointComponent", () => {
  let component: AddEndpointComponent;
  let fixture: ComponentFixture<AddEndpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEndpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEndpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
