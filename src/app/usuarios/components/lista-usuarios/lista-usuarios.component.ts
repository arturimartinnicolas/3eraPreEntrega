import {  AfterViewInit,  Component,  OnDestroy,  OnInit,  ViewChild,} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SesionService } from 'src/app/core/services/sesion.service';
import { Usuario } from '../../models/usuario';
import { UsuariosService } from '../../service/usuarios.service';
import { DatosUsuarioDialogComponent } from '../datos-usuario-dialog/datos-usuario-dialog.component';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css'],
})
export class ListaUsuariosComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  subscripcion!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;

  columnas: string[] = ['usuario', 'esAdmin', 'acciones'];
  dataSource: MatTableDataSource<Usuario> =
    new MatTableDataSource<Usuario>();

  constructor(
    private usuariosService: UsuariosService,
    private sesionService: SesionService,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.subscripcion) {
      this.subscripcion.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.sesionService.establecerMenuActivo('Usuarios');
    this.actualizarLista();

    this.dataSource.filterPredicate = function (
      usuario: Usuario,
      filtro: string
    ) {
      return usuario.usuario
        .toLocaleLowerCase()
        .includes(filtro.toLocaleLowerCase());
    };
  }

  actualizarLista() {
    this.subscripcion = this.usuariosService.obtenerUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.dataSource.data = usuarios;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  editar(id: number) {
    let position = this.dataSource.data.findIndex(
      (usuario) => usuario.id == id
    );
    let usuarioData = this.dataSource.data[position];

    let dialog = this.dialog.open(DatosUsuarioDialogComponent, {
      width: '50%',
      height: '80%',
      data: usuarioData,
    });
    dialog.beforeClosed().subscribe((res) => {
      if (res) {
        this.usuariosService
          .modificarUsuario(id, res)
          .subscribe((usuario) => this.actualizarLista());
      }
    });
  }

  borrar(id: number) {
    this.usuariosService
      .borrarUsuario(id)
      .subscribe((usuario) => this.actualizarLista());
  }
  openDialog() {
    let dialog = this.dialog.open(DatosUsuarioDialogComponent, {
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
        this.usuariosService
          .agregarUsuario(newData)
          .subscribe((usuario) => this.actualizarLista());
      }
    });
  }

  obtenerProximoId() {
    let maxId: number = 0;
    this.dataSource.data.forEach((usuario) => {
      if (usuario.id > maxId) {
        maxId = usuario.id;
      }
    });
    return maxId + 1;
  }
}
