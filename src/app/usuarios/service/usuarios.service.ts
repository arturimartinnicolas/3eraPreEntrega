import {  HttpClient,  HttpErrorResponse,  HttpHeaders,} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  borrarUsuario(id: number): Observable<Usuario> {
    return this.http
      .delete<Usuario>(`${environment.api}/usuarios/${id}`)
      .pipe(catchError(this.manejarError));
  }
  agregarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${environment.api}/usuarios/`, usuario, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .pipe(catchError(this.manejarError));
  }
  modificarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${environment.api}/usuarios/${id}`, usuario, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .pipe(catchError(this.manejarError));
  }
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${environment.api}/usuarios/`)
      .pipe(catchError(this.manejarError));
  }

  constructor(private http: HttpClient) {}

  private manejarError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.warn('Error en el cliente', error.error.message);
    } else {
      console.warn('Error en el servidor', error.error.message);
    }

    return throwError(() => new Error('Error en la comunicacion HTTP'));
  }
}
