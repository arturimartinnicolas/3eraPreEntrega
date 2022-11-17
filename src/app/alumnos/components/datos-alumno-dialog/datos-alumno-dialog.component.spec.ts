import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatosAlumnoDialogComponent } from './datos-alumno-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

describe('DatosAlumnoDialogComponent (alta)', () => {
  let component: DatosAlumnoDialogComponent;
  let fixture: ComponentFixture<DatosAlumnoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [DatosAlumnoDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: DatosAlumnoDialogComponent },
        { provide: MAT_DIALOG_DATA, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosAlumnoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('El formulario se mantiene invalido cuando no ingreso el nombre', () => {
    const formulario = component.formulario;
    const apellido = formulario.controls['apellido'];
    apellido.setValue('Arturi');
    const edad = formulario.controls['edad'];
    edad.setValue(30);
    const genero = formulario.controls['genero'];
    genero.setValue('M');

    expect(formulario.valid).toBeFalse();
  });

  it('El formulario se mantiene invalido cuando no ingreso el apellido', () => {
    const formulario = component.formulario;
    const nombre = formulario.controls['nombre'];
    nombre.setValue('Martin');
    const edad = formulario.controls['edad'];
    edad.setValue(30);
    const genero = formulario.controls['genero'];
    genero.setValue('M');

    expect(formulario.valid).toBeFalse();
  });

  it('El formulario se mantiene valido cuando ingreso los 4 campos requeridos', () => {
    const formulario = component.formulario;
    const apellido = formulario.controls['apellido'];
    apellido.setValue('Arturi');
    const nombre = formulario.controls['nombre'];
    nombre.setValue('Martin');
    const edad = formulario.controls['edad'];
    edad.setValue(30);
    const genero = formulario.controls['genero'];
    genero.setValue('M');

    expect(formulario.valid).toBeTrue();
  });

  it('El valor del formulario devuelve el objeto correcto', () => {
    const formulario = component.formulario;
    const apellido = formulario.controls['apellido'];
    apellido.setValue('Arturi');
    const nombre = formulario.controls['nombre'];
    nombre.setValue('Martin');
    const edad = formulario.controls['edad'];
    edad.setValue(30);
    const genero = formulario.controls['genero'];
    genero.setValue('M');

    const mockAlumno = {
      nombre: 'Martin',
      apellido: 'Arturi',
      edad: 30,
      genero: 'M',
    };
    expect(formulario.value).toEqual(mockAlumno);
  });
});

