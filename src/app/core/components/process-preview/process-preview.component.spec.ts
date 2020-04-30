import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPreviewComponent } from './process-preview.component';

describe('ProcessPreviewComponent', () => {
  let component: ProcessPreviewComponent;
  let fixture: ComponentFixture<ProcessPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
