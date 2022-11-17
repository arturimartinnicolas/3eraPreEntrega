import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DetalleAlumnoDialogComponent } from './detalle-alumno-dialog.component';
import { ApellidoNombrePipe } from 'src/app/shared/pipes/apellido-nombre.pipe';
import { FemeninoMasculinoPipe } from 'src/app/shared/pipes/femenino-masculino.pipe';
import { MaterialModule } from 'src/app/material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of, throwError } from 'rxjs';
import { Inscripcion } from 'src/app/inscripciones/models/inscripcion';
import { Curso } from 'src/app/cursos/models/curso';
import { CursosService } from 'src/app/cursos/services/cursos.service';
import { InscripcionesModule } from 'src/app/inscripciones/inscripciones.module';
import { InscripcionesService } from 'src/app/inscripciones/services/inscripciones.service';
import { Injectable } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Injectable({
  providedIn: 'root',
})
class InscripcionesServiceMock extends InscripcionesService {
  data: Inscripcion[] = [
    {
      cursoId: 1,
      alumnoId: 1,
      id: 1,
    },
    {
      cursoId: 2,
      alumnoId: 8,
      id: 2,
    },
  ];

  override obtenerInscripciones(): Observable<Inscripcion[]> {
    return of(this.data);
  }
  override borrarInscripcion(id: number): Observable<Inscripcion> {
    let ix = this.data.findIndex((curso) => curso.id == id);
    const removedData = this.data.splice(ix, 1);
    return of(removedData[0]);
  }
}

@Injectable({
  providedIn: 'root',
})
class CursosServiceMock extends CursosService {
  data: Curso[] = [
    {
      nombre: 'VueJS',
      comision: '47933-9521',
      profesor: 'Mylene',
      fechaInicio: new Date('2022-01-27T23:57:10.782Z'),
      fechaFin: new Date('2022-12-17T15:34:30.850Z'),
      inscripcionAbierta: false,
      id: 4,
    },
    {
      nombre: 'SQL',
      comision: '18344-0234',
      profesor: 'Kasandra',
      fechaInicio: new Date('2022-10-23T09:51:58.694Z'),
      fechaFin: new Date('2023-06-30T03:37:48.601Z'),
      inscripcionAbierta: true,
      id: 5,
    },
  ];
  override obtenerCurso(id: number): Observable<Curso> {
    let ix = this.data.findIndex((curso) => curso.id == id);
    return of(this.data[ix]);
  }
}

@Injectable({
  providedIn: 'root',
})
class ErrorInscripcionesServiceMock extends InscripcionesService {
  override obtenerInscripciones(): Observable<Inscripcion[]> {
    return throwError(() => new Error('Error provocado para test'));
  }
}

describe('DetalleAlumnoDialogComponent', () => {
  let component: DetalleAlumnoDialogComponent;
  let fixture: ComponentFixture<DetalleAlumnoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        InscripcionesModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        DetalleAlumnoDialogComponent,
        ApellidoNombrePipe,
        FemeninoMasculinoPipe,
      ],
      providers: [
        { provide: InscripcionesService, useClass: InscripcionesServiceMock },
        { provide: CursosService, useClass: CursosServiceMock },
        { provide: MatDialogRef, useValue: DetalleAlumnoDialogComponent },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            nombre: 'Matias',
            apellido: 'Sanchez',
            edad: 31,
            genero: 'M',
            fechaDeIngreso: new Date('2022-10-30T22:46:07.783Z'),
            id: 1,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleAlumnoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Borrar una inscripción del alumno', (done: DoneFn) => {
    component.borrar(2);
    expect(component.dataSource.data.length).toBe(0);
    done();
  });

});

describe('DetalleAlumnoDialogComponent (Error)', () => {
  let component: DetalleAlumnoDialogComponent;
  let fixture: ComponentFixture<DetalleAlumnoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        InscripcionesModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        DetalleAlumnoDialogComponent,
        ApellidoNombrePipe,
        FemeninoMasculinoPipe,
      ],
      providers: [
        {
          provide: InscripcionesService,
          useClass: ErrorInscripcionesServiceMock,
        },
        { provide: CursosService, useClass: CursosServiceMock },
        { provide: MatDialogRef, useValue: DetalleAlumnoDialogComponent },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            nombre: 'Matias',
            apellido: 'Sanchez',
            edad: 31,
            genero: 'M',
            fechaDeIngreso: new Date('2022-10-30T22:46:07.783Z'),
            id: 1,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleAlumnoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Captura el error desde el servicio de inscripciones', (done: DoneFn) => {
    component.actualizarLista();
    expect(component.dataSource.data.length).toBe(0);
    done();
  });
});
