import {  HttpClient,  HttpErrorResponse,  HttpHeaders,} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  constructor(private http: HttpClient) {}

  obtenerCursos(): Observable<Curso[]> {
    return this.http
      .get<Curso[]>(`${environment.api}/cursos?` + Math.random())
      .pipe(catchError(this.manejarError));
  }

  agregarCurso(curso: Curso): Observable<Curso> {
    return this.http
      .post<Curso>(`${environment.api}/cursos/`, curso, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
      .pipe(catchError(this.manejarError));
  }

  borrarCurso(id: number): Observable<Curso> {
    return this.http
      .delete<Curso>(`${environment.api}/cursos/${id}`)
      .pipe(catchError(this.manejarError));
  }

  modificarCurso(id: number, curso: Curso): Observable<Curso> {
    return this.http
      .put<Curso>(`${environment.api}/cursos/${id}`, curso, {
        headers: new HttpHeaders({
          'content-type': 'application/json',
          encoding: 'UTF-8',
        }),
      })
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

  obtenerCurso(id: number): Observable<Curso> {
    return this.http
      .get<Curso>(`${environment.api}/cursos/${id}`)
      .pipe(catchError(this.manejarError));
  }
}
