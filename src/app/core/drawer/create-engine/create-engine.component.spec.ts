import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateEngineComponent } from "./create-engine.component";

describe("CreateEngineComponent", () => {
  let component: CreateEngineComponent;
  let fixture: ComponentFixture<CreateEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
