export interface Alumno {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  genero: 'M' | 'F';
  fechaDeIngreso: Date;
}
