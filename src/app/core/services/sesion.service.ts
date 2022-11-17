import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Usuario } from 'src/app/usuarios/models/usuario';
import { Sesion } from '../models/sesion';

@Injectable({
  providedIn: 'root',
})
export class SesionService {
  sesion!: Sesion;
  sesionSubject!: BehaviorSubject<Sesion>;
  sesion$!: Observable<Sesion>;
  constructor() {
    this.sesion = {
      sesionActiva: false,
    };
    this.sesionSubject = new BehaviorSubject(this.sesion);
    this.sesion$ = this.sesionSubject.asObservable();
  }

  establecerSesion(usuario: Usuario, menu: string) {
    this.sesion = {
      sesionActiva: true,
      usuarioActivo: usuario,
      menuActivo: menu,
    };

    this.sesionSubject.next(this.sesion);
  }
  establecerMenuActivo(menu: string) {
    this.sesion.menuActivo = menu;
    this.sesionSubject.next(this.sesion);
  }
  borrarSesion() {
    this.sesion = {
      sesionActiva: false,
    };

    this.sesionSubject.next(this.sesion);
  }

  obtenerSesion(): Observable<Sesion> {
    return this.sesionSubject.asObservable();
  }
}
