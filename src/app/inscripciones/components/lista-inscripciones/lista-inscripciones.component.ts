import {  AfterViewInit,  Component,  OnDestroy,  OnInit,  ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AlumnosService } from 'src/app/alumnos/services/alumnos.service';
import { CursosService } from 'src/app/cursos/services/cursos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Inscripcion } from '../../models/inscripcion';
import { InscripcionConNombre } from '../../models/InscripcionConNombre';
import { InscripcionesService } from '../../services/inscripciones.service';
import { DatosInscripcionDialogComponent } from '../datos-inscripcion-dialog/datos-inscripcion-dialog.component';
import { MatSort } from '@angular/material/sort';
import { Curso } from 'src/app/cursos/models/curso';
import { Alumno } from 'src/app/alumnos/models/alumno';
import { SesionService } from 'src/app/core/services/sesion.service';

@Component({
  selector: 'app-lista-inscripciones',
  templateUrl: './lista-inscripciones.component.html',
  styleUrls: ['./lista-inscripciones.component.css'],
})
export class ListaInscripcionesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  subscripcion!: Subscription;
  cursos!: Curso[];
  alumnos!: Alumno[];

  @ViewChild(MatSort) sort!: MatSort;

  columnas: string[] = [    'cursoId',    'cursoNombre',    'alumnoId',    'alumnoNombre',    'acciones',  ];
  dataSource: MatTableDataSource<InscripcionConNombre> =
    new MatTableDataSource<InscripcionConNombre>();
  formulario!: FormGroup;

  constructor(
    private inscripcionesService: InscripcionesService,
    private cursosService: CursosService,
    private alumnosService: AlumnosService,
    private sesionService: SesionService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sesionService.establecerMenuActivo('Inscripciones');
    this.formulario = this.formBuilder.group({
      filtroCurso: ['', []],
      filtroAlumno: ['', []],
    });

    this.actualizarLista();
  }

  actualizarLista() {
    this.cursosService.obtenerCursos().subscribe((cursos: Curso[]) => {
      this.cursos = cursos;
      this.alumnosService.obtenerAlumnos().subscribe((alumnos: Alumno[]) => {
        this.alumnos = alumnos;

        this.subscripcion = this.inscripcionesService
          .obtenerInscripciones()
          .subscribe({
            next: (inscripciones: Inscripcion[]) => {
              let data: InscripcionConNombre[] = [];
              inscripciones.forEach((inscripcion) => {
                let curso = this.cursos.find(
                  (curso2) => curso2.id == inscripcion.cursoId
                );
                let alumno = this.alumnos.find(
                  (alumno2) => alumno2.id == inscripcion.alumnoId
                );
                data.push({
                  id: inscripcion.id,
                  cursoId: inscripcion.cursoId,
                  cursoNombre: curso!.nombre,
                  alumnoId: inscripcion.alumnoId,
                  alumnoNombre: alumno?.apellido + ' ' + alumno?.nombre,
                });
              });
              this.dataSource.data = data;
            },
            error: (error) => {
              console.error(error);
            },
          });
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  editar(id: number) {
    let position = this.dataSource.data.findIndex(
      (inscripcion) => inscripcion.id == id
    );
    let inscripcionData = this.dataSource.data[position];

    let dialog = this.dialog.open(DatosInscripcionDialogComponent, {
      width: '50%',
      height: '80%',
      data: inscripcionData,
    });

    dialog.beforeClosed().subscribe((res) => {
      if (res) {
        this.inscripcionesService.obtenerInscripciones().subscribe({
          next: (inscripciones: Inscripcion[]) => {
            let existeInsc = false;
            inscripciones.forEach((inscripcion) => {
              if (
                inscripcion.alumnoId == res.alumnoId &&
                inscripcion.cursoId == res.cursoId
              ) {
                existeInsc = true;
              }
            });
            if (!existeInsc) {
              this.inscripcionesService
                .modificarInscripcion(id, res)
                .subscribe((inscripcion) => this.actualizarLista());
            } else {
              this.openSnackBar(
                'Ya existe esta subscripción',
                'Cancelado',
                3000
              );
            }
          },
        });
      }
    });
  }

  borrar(id: number) {
    this.inscripcionesService
      .borrarInscripcion(id)
      .subscribe((inscripcion) => this.actualizarLista());
  }
  openDialog() {
    let dialog = this.dialog.open(DatosInscripcionDialogComponent, {
      width: '50%',
      height: '80%',
    });

    dialog.beforeClosed().subscribe((res) => {
      if (res) {
        this.inscripcionesService.obtenerInscripciones().subscribe({
          next: (inscripciones: Inscripcion[]) => {
            let existeInsc = false;
            inscripciones.forEach((inscripcion) => {
              if (
                inscripcion.alumnoId == res.alumnoId &&
                inscripcion.cursoId == res.cursoId
              ) {
                existeInsc = true;
              }
            });
            if (!existeInsc) {
              let newId: number = this.obtenerProximoId();
              let newData = {
                ...res,
                id: newId,
              };
              this.inscripcionesService
                .agregarInscripcion(newData)
                .subscribe((inscripcion) => this.actualizarLista());
            } else {
              this.openSnackBar(
                'Ya existe esta subscripción',
                'Cancelado',
                3000
              );
            }
          },
        });
      }
    });
  }

  openSnackBar(message: string, action: string, duration: number) {
    if (duration && duration > 0) {
      this.matSnackBar.open(message, action, { duration: duration });
    } else {
      this.matSnackBar.open(message, action);
    }
  }

  obtenerProximoId() {
    let maxId: number = 0;
    this.dataSource.data.forEach((inscripcion) => {
      if (inscripcion.id > maxId) {
        maxId = inscripcion.id;
      }
    });
    return maxId + 1;
  }
}
