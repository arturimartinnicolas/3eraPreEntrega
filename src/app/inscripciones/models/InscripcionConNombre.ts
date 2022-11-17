import { Inscripcion } from './inscripcion';

export interface InscripcionConNombre extends Inscripcion {
  cursoNombre: string;
  alumnoNombre: string;
}
