import {  AfterViewInit,  Component,  OnDestroy,  OnInit,  ViewChild,} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { CursosService } from '../../services/cursos.service';
import { Curso } from '../../models/curso';
import { DatosCursoDialogComponent } from '../datos-curso-dialog/datos-curso-dialog.component';
import { InscripcionesService } from 'src/app/inscripciones/services/inscripciones.service';
import { DetalleCursoDialogComponent } from '../detalle-curso-dialog/detalle-curso-dialog.component';
import { MatSort } from '@angular/material/sort';
import { SesionService } from 'src/app/core/services/sesion.service';
import { Sesion } from 'src/app/core/models/sesion';

@Component({
  selector: 'app-lista-cursos',
  templateUrl: './lista-cursos.component.html',
  styleUrls: ['./lista-cursos.component.css'],
})
export class ListaCursosComponent implements OnInit, OnDestroy, AfterViewInit {
  subscripcion!: Subscription;
  sesion$!: Observable<Sesion>;


  @ViewChild(MatSort) sort!: MatSort;

  columnas: string[] = [    'nombre',    'comision',    'profesor',    'fechaInicio',    'fechaFin',    'inscripcionAbierta',    'acciones',  ];
  dataSource: MatTableDataSource<Curso> = new MatTableDataSource<Curso>();

  constructor(
    private cursosService: CursosService,
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
    this.sesionService.establecerMenuActivo('Cursos');
    this.sesion$ = this.sesionService.obtenerSesion();
    this.actualizarLista();

    this.dataSource.filterPredicate = function (
      curso: Curso,
      filtro: string
    ) {
      return (
        curso.nombre.toLocaleLowerCase().includes(filtro.toLocaleLowerCase()) ||
        curso.comision
          .toLocaleLowerCase()
          .includes(filtro.toLocaleLowerCase()) ||
        curso.profesor.toLocaleLowerCase().includes(filtro.toLocaleLowerCase())
      );
    };
  }

  actualizarLista() {
    this.subscripcion = this.cursosService.obtenerCursos().subscribe({
      next: (cursos: Curso[]) => {
        this.dataSource.data = cursos;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  editar(id: number) {
    let position = this.dataSource.data.findIndex((curso) => curso.id == id);
    let cursoData = this.dataSource.data[position];

    let dialog = this.dialog.open(DatosCursoDialogComponent, {
      width: '50%',
      height: '80%',
      data: cursoData,
    });

    dialog.beforeClosed().subscribe((res) => {
      if (res) {
        let newData = {
          ...res,
          id: id,
        };
        this.cursosService
          .modificarCurso(id, newData)
          .subscribe((curso) => this.actualizarLista());
      }
    });
  }
  verDetalle(id: number) {
    {
      let position = this.dataSource.data.findIndex((curso) => curso.id == id);
      let cursoData = this.dataSource.data[position];

      let dialog = this.dialog.open(DetalleCursoDialogComponent, {
        width: '80%',
        height: '80%',
        data: cursoData,
      });
    }
  }

  borrar(id: number) {
    this.cursosService
      .borrarCurso(id)
      .subscribe((curso) => this.actualizarLista());
    this.inscripcionService.borrarInscripcionesPorCurso(id);
  }

  openDialog() {
    let dialog = this.dialog.open(DatosCursoDialogComponent, {
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
        this.cursosService
          .agregarCurso(newData)
          .subscribe((curso) => this.actualizarLista());
      }
    });
  }



  obtenerProximoId() {
    let maxId: number = 0;
    this.dataSource.data.forEach((curso) => {
      if (curso.id > maxId) {
        maxId = curso.id;
      }
    });
    return maxId + 1;
  }
}
