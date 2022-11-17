import { Pipe, PipeTransform } from '@angular/core';
import { Alumno } from 'src/app/alumnos/models/alumno';

@Pipe({
  name: 'apellidoNombre',
})
export class ApellidoNombrePipe implements PipeTransform {
  transform(value: Alumno, ...args: number[]): string {
    if (args[0] == 0) {
      return value.nombre + ' ' + value.apellido;
    }
    return value.apellido + ', ' + value.nombre;
  }
}
