import { TestBed } from '@angular/core/testing';

import { AlumnosService } from './alumnos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Alumno } from '../models/alumno';
import { HttpErrorResponse } from '@angular/common/http';

describe('AlumnosService', () => {
  let service: AlumnosService;
  let httpClientSpy: {
    get: jasmine.Spy;
    post: jasmine.Spy;
    put: jasmine.Spy;
    delete: jasmine.Spy;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    service = new AlumnosService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('El metodo agregarAlumno agrega un alumno', (done: DoneFn) => {
    const nuevoAlumno: Alumno = {
      nombre: 'Martin',
      apellido: 'Arturi',
      edad: 30,
      genero: 'M',
      fechaDeIngreso: new Date('2022-11-22T03:44:31.032Z'),
      id: 1,
    };
    httpClientSpy.post.and.returnValue(of(nuevoAlumno));

    service.agregarAlumno(nuevoAlumno).subscribe((alumno) => {
      expect(alumno).toEqual(nuevoAlumno);
      done();
    });
  });

  it('El metodo agregarAlumno agrega un alumno', (done: DoneFn) => {
    const nuevoAlumno: Alumno = {
      nombre: 'Martin',
      apellido: 'Arturi',
      edad: 30,
      genero: 'M',
      fechaDeIngreso: new Date('2022-11-22T03:44:31.032Z'),
      id: 1,
    };
    httpClientSpy.post.and.returnValue(of(nuevoAlumno));

    service.agregarAlumno(nuevoAlumno).subscribe((alumno) => {
      expect(alumno).toEqual(nuevoAlumno);
      done();
    });
  });

  it('El metodo obtenerAlumnos retorna un arreglo de alumnos', (done: DoneFn) => {
    const alumnosMock: Alumno[] = [
      {
        nombre: 'Willy',
        apellido: 'Botsford',
        edad: 52,
        genero: 'M',
        fechaDeIngreso: new Date('2022-10-30T22:46:07.783Z'),
        id: 1,
      },
      {
        nombre: 'Marlin',
        apellido: 'Hoppe',
        edad: 32,
        genero: 'M',
        fechaDeIngreso: new Date('2022-10-30T09:23:02.626Z'),
        id: 2,
      },
      {
        nombre: 'Berenice',
        apellido: 'Hermiston',
        edad: 37,
        genero: 'F',
        fechaDeIngreso: new Date('2022-10-30T04:16:51.374Z'),
        id: 3,
      },
      {
        nombre: 'Abby',
        apellido: 'Champlin',
        edad: 54,
        genero: 'F',
        fechaDeIngreso: new Date('2022-10-30T03:44:31.032Z'),
        id: 4,
      },
    ];

    httpClientSpy.get.and.returnValue(of(alumnosMock));

    service.obtenerAlumnos().subscribe((alumnos) => {
      expect(alumnos).toEqual(alumnosMock);
      done();
    });
  });

  

  it('El metodo obtenerAlumno obtiene un alumno', (done: DoneFn) => {
    const idAlumnoAObtener: number = 1;
    const alumnoAObtener: Alumno = {
      nombre: 'Martin',
      apellido: 'Nicolas',
      edad: 30,
      genero: 'M',
      fechaDeIngreso: new Date('2022-11-22T03:44:31.032Z'),
      id: 1,
    };
    httpClientSpy.get.and.returnValue(of(alumnoAObtener));

    service.obtenerAlumno(idAlumnoAObtener).subscribe((alumno) => {
      expect(alumno).toEqual(alumnoAObtener);
      done();
    });
  });

  it('El metodo manejarError lanza un error del servidor', (done: DoneFn) => {
    const err: HttpErrorResponse = new HttpErrorResponse({
      error: { message: 'El test lanza este error' },
    });
    (service as any).manejarError(err).subscribe({
      next(sinError: any) {
        expect(false).toEqual(true);
        done();
      },
      error(objError: any) {
        expect(objError).toMatch('Error en la comunicacion HTTP');
        done();
      },
    });
  });

  it('El metodo manejarError lanza un error del cliente', (done: DoneFn) => {
    const evError: ErrorEvent = new ErrorEvent('Cliente desconectado');
    const err: HttpErrorResponse = new HttpErrorResponse({
      error: evError,
    });
    (service as any).manejarError(err).subscribe({
      next(sinError: any) {
        expect(false).toEqual(true);
        done();
      },
      error(objError: any) {
        expect(objError).toMatch('Error en la comunicacion HTTP');
        done();
      },
    });
  });
});
