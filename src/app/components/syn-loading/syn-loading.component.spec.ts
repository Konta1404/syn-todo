import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynLoadingComponent } from './syn-loading.component';

describe('SynLoadingComponent', () => {
  let component: SynLoadingComponent;
  let fixture: ComponentFixture<SynLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
