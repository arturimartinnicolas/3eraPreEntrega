import {  HttpClient,  HttpErrorResponse,  HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Inscripcion } from '../models/inscripcion';

@Injectable({
  providedIn: 'root',
})
export class InscripcionesService {
  borrarInscripcionesPorCurso(id: number) {
    this.http
      .get<Inscripcion[]>(`${environment.api}/inscripciones?` + Math.random())
      .pipe(catchError(this.manejarError))
      .subscribe((inscripciones: Inscripcion[]) => {
        let inscripcionesDelCurso = inscripciones.filter(
          (insc) => insc.cursoId == id
        );
        inscripcionesDelCurso.forEach((inscripcionDelCurso) =>
          this.borrarInscripcion(inscripcionDelCurso.id).subscribe()
        );
      });
  }
  borrarInscripcionesPorAlumno(id: number) {
    this.http
      .get<Inscripcion[]>(`${environment.api}/inscripciones?` + Math.random())
      .pipe(catchError(this.manejarError))
      .subscribe((inscripciones: Inscripcion[]) => {
        let inscripcionesDelAlumno = inscripciones.filter(
          (insc) => insc.alumnoId == id
        );
        inscripcionesDelAlumno.forEach((inscripcionDelAlumno) =>
          this.borrarInscripcion(inscripcionDelAlumno.id).subscribe()
        );
      });
  }
  constructor(private http: HttpClient) {}

  obtenerInscripciones(): Observable<Inscripcion[]> {
    return this.http
      .get<Inscripcion[]>(`${environment.api}/inscripciones?` + Math.random())
      .pipe(catchError(this.manejarError));
  }

  agregarInscripcion(inscripcion: Inscripcion): Observable<Inscripcion> {
    return this.http
      .post<Inscripcion>(`${environment.api}/inscripciones/`, inscripcion, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .pipe(catchError(this.manejarError));
  }

  borrarInscripcion(id: number): Observable<Inscripcion> {
    return this.http
      .delete<Inscripcion>(`${environment.api}/inscripciones/${id}`)
      .pipe(catchError(this.manejarError));
  }

  modificarInscripcion(
    id: number,
    inscripcion: Inscripcion
  ): Observable<Inscripcion> {
    return this.http
      .put<Inscripcion>(
        `${environment.api}/inscripciones/${id}`,
        inscripcion,
        {
          headers: new HttpHeaders({
            'content-type': 'application/json',
            encoding: 'UTF-8',
          }),
        }
      )
      .pipe(catchError(this.manejarError));
  }

  private manejarError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.warn('Error en el cliente', error.error.message);
    } else {
      console.warn('Error en el servidor', error.error.message);
    }

    return throwError(() => new Error('Error en la comunicacion HTTP'));
  }
}
