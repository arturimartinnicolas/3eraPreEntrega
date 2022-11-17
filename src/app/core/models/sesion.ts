import { Usuario } from '../../usuarios/models/usuario';

export interface Sesion {
  sesionActiva: boolean;
  usuarioActivo?: Usuario;
  menuActivo?: string;
}
