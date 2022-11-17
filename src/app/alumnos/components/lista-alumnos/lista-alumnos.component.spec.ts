import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaAlumnosComponent } from './lista-alumnos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material/material.module';
import { AlumnosService } from '../../services/alumnos.service';
import { Alumno } from '../../models/alumno';
import { Observable, of, throwError } from 'rxjs';
import { InscripcionesService } from 'src/app/inscripciones/services/inscripciones.service';
import { Injectable } from '@angular/core';
import { Inscripcion } from 'src/app/inscripciones/models/inscripcion';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
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
      alumnoId: 2,
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

  override borrarInscripcionesPorAlumno(id: number) {
    let inscripcionesDelAlumno = this.data.filter(
      (insc) => insc.alumnoId == id
    );
    inscripcionesDelAlumno.forEach((inscripcionDelAlumno) =>
      this.borrarInscripcion(inscripcionDelAlumno.id).subscribe()
    );
  }
}

@Injectable({
  providedIn: 'root',
})
class AlumnosServiceMock extends AlumnosService {
  data: Alumno[] = [
    {
      nombre: 'Erica',
      apellido: 'Rivas',
      edad: 29,
      genero: 'F',
      fechaDeIngreso: new Date('2022-10-30T22:46:07.783Z'),
      id: 2,
    },
    {
      nombre: 'Carlos',
      apellido: 'Rodriguez',
      edad: 27,
      genero: 'M',
      fechaDeIngreso: new Date('2022-10-30T22:46:07.783Z'),
      id: 3,
    },
  ];
  override obtenerAlumno(id: number): Observable<Alumno> {
    let ix = this.data.findIndex((alumno) => alumno.id == id);
    return of(this.data[ix]);
  }

  override obtenerAlumnos(): Observable<Alumno[]> {
    return of(this.data);
  }

  override borrarAlumno(id: number): Observable<Alumno> {
    let ix = this.data.findIndex((alumno) => alumno.id == id);
    const removedData = this.data.splice(ix, 1);
    return of(removedData[0]);
  }
  override agregarAlumno(alumno: Alumno): Observable<Alumno> {
    this.data.push(alumno);
    return of(alumno);
  }
  override modificarAlumno(id: number, alumno: Alumno): Observable<Alumno> {
    let ix = this.data.findIndex((alumno) => alumno.id == id);
    this.data[ix] = alumno;
    return of(alumno);
  }
}

@Injectable({
  providedIn: 'root',
})
class ErrorAlumnosServiceMock extends AlumnosService {
  override obtenerAlumnos(): Observable<Alumno[]> {
    return throwError(() => new Error('Error provocado para test'));
  }
}
class DatosAlumnosDialogMock {
  result!: Alumno;

  setResult(val: Alumno) {
    this.result = val;
  }
  open() {
    return {
      beforeClosed: () =>
        of({
          nombre: 'Matias',
          apellido: 'Sanchez',
          edad: 31,
          genero: 'M',
          fechaDeIngreso: new Date('2022-10-30T22:46:07.783Z'),
          id: 1,
        }),
    };
  }
  // open() {}
  close() {
    return of(this.result);
  }
  afterClosed() {
    return of(this.result);
  }
}
describe('ListaAlumnosComponent', () => {
  let component: ListaAlumnosComponent;
  let fixture: ComponentFixture<ListaAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [ListaAlumnosComponent],
      providers: [
        { provide: AlumnosService, useClass: AlumnosServiceMock },
        { provide: InscripcionesService, useClass: InscripcionesServiceMock },
        { provide: MatDialog, useClass: DatosAlumnosDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Actualizar lista de alumnos', (done: DoneFn) => {
    component.ngOnInit();
    expect(component.dataSource.data.length).toBe(2);
    done();
  });

  it('Borrar un alumno', (done: DoneFn) => {
    component.borrar(2);
    expect(component.dataSource.data.length).toBe(1);
    done();
  });

  it('Modificar un alumno', (done: DoneFn) => {
    component.editar(1);
    let ix = component.dataSource.data.findIndex((alumno) => alumno.id == 1);
    expect(component.dataSource.data[ix].nombre).toMatch('Matias');
    done();
  });

  it('Ver detalle de un alumno', (done: DoneFn) => {
    component.verDetalle(1);
    expect(true).toBe(true);
    done();
  });
  it('Alta de un alumno', (done: DoneFn) => {
    const len = component.dataSource.data.length;
    component.openDialog();
    const newLen = component.dataSource.data.length;
    expect(newLen).toBe(len + 1);
    done();
  });

});

describe('ListaAlumnosComponent (error)', () => {
  let component: ListaAlumnosComponent;
  let fixture: ComponentFixture<ListaAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      declarations: [ListaAlumnosComponent],
      providers: [
        { provide: AlumnosService, useClass: ErrorAlumnosServiceMock },
        { provide: InscripcionesService, useClass: InscripcionesServiceMock },
        { provide: MatDialog, useClass: DatosAlumnosDialogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Captura el error desde el servicio de alumnos', (done: DoneFn) => {
    component.actualizarLista();
    expect(component.dataSource.data.length).toBe(0);
    done();
  });
});
