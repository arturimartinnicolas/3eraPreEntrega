import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleCursoDialogComponent } from './detalle-curso-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('DetalleCursoDialogComponent', () => {
  let component: DetalleCursoDialogComponent;
  let fixture: ComponentFixture<DetalleCursoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [DetalleCursoDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: DetalleCursoDialogComponent },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            nombre: 'Angular',
            comision: '47345-9241',
            profesor: 'Maximiliano',
            fechaInicio: '2022-01-27T23:57:10.782Z',
            fechaFin: '2022-12-17T15:34:30.850Z',
            inscripcionAbierta: true,
            id: '3',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleCursoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
