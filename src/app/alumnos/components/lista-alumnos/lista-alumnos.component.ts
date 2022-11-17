import {  AfterViewInit,  Component,  OnDestroy,  OnInit,  ViewChild,} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { InscripcionesService } from 'src/app/inscripciones/services/inscripciones.service';
import { Alumno } from '../../models/alumno';
import { AlumnosService } from '../../services/alumnos.service';
import { DatosAlumnoDialogComponent } from '../datos-alumno-dialog/datos-alumno-dialog.component';
import { DetalleAlumnoDialogComponent } from '../detalle-alumno-dialog/detalle-alumno-dialog.component';
import { MatSort } from '@angular/material/sort';
import { SesionService } from 'src/app/core/services/sesion.service';
import { Sesion } from 'src/app/core/models/sesion';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.css'],
})
export class ListaAlumnosComponent implements OnInit, OnDestroy, AfterViewInit {
  subscripcion!: Subscription;
  sesion$!: Observable<Sesion>;

  @ViewChild(MatSort) sort!: MatSort;

  columnas: string[] = [    'nombre',    'edad',    'genero',    'fechaDeIngreso',    'acciones',  ];
  dataSource: MatTableDataSource<Alumno> = new MatTableDataSource<Alumno>();

  constructor(
    private alumnosService: AlumnosService,
    private inscripcionService: InscripcionesService,
    private sesionService: SesionService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sesionService.establecerMenuActivo('Alumnos');
    this.sesion$ = this.sesionService.obtenerSesion();
    this.actualizarLista();

    this.dataSource.filterPredicate = function (
      alumno: Alumno,
      filtro: string
    ) {
      return (
        alumno.nombre
          .toLocaleLowerCase()
          .includes(filtro.toLocaleLowerCase()) ||
        alumno.apellido.toLocaleLowerCase().includes(filtro.toLocaleLowerCase())
      );
    };
  }

  actualizarLista() {
    this.subscripcion = this.alumnosService.obtenerAlumnos().subscribe({
      next: (alumnos: Alumno[]) => {
        this.dataSource.data = alumnos;
      },
      error: (error) => {
        alert('hubo un error al obtener los alumnos: ' + error.message);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  editar(id: number) {
    let position = this.dataSource.data.findIndex((alumno) => alumno.id == id);
    let alumnoData = this.dataSource.data[position];

    let dialog = this.dialog.open(DatosAlumnoDialogComponent, {
      width: '50%',
      height: '80%',
      data: alumnoData,
    });
    dialog.beforeClosed().subscribe((res) => {
      if (res) {
        this.alumnosService
          .modificarAlumno(id, res)
          .subscribe((alumno) => this.actualizarLista());
      }
    });
  }
  verDetalle(id: number) {
    {
      let position = this.dataSource.data.findIndex(
        (alumno) => alumno.id == id
      );
      let alumnoData = this.dataSource.data[position];

      let dialog = this.dialog.open(DetalleAlumnoDialogComponent, {
        width: '80%',
        height: '80%',
        data: alumnoData,
      });
    }
  }

  borrar(id: number) {
    this.alumnosService
      .borrarAlumno(id)
      .subscribe((alumno) => this.actualizarLista());
    this.inscripcionService.borrarInscripcionesPorAlumno(id);
  }
  openDialog() {
    let dialog = this.dialog.open(DatosAlumnoDialogComponent, {
      width: '50%',
      height: '80%',
    });

    dialog.beforeClosed().subscribe((res) => {
      if (res) {
        let newId: number = this.obtenerProximoId();
        let newData = {
          ...res,
          id: newId,
        };
        newData.fechaDeIngreso = new Date();
        this.alumnosService
          .agregarAlumno(newData)
          .subscribe((alumno) => this.actualizarLista());
      }
    });
  }

  obtenerProximoId() {
    let maxId: number = 0;
    this.dataSource.data.forEach((alumno) => {
      if (alumno.id > maxId) {
        maxId = alumno.id;
      }
    });
    return maxId + 1;
  }
}
