import dayjs from 'dayjs/esm';
import { SimNao } from 'app/entities/enumerations/sim-nao.model';

export interface IPessoa {
  id?: number;
  nome?: string;
  fotoContentType?: string;
  foto?: string;
  dtNascimento?: dayjs.Dayjs | null;
  cpf?: string | null;
  ativo?: SimNao | null;
}

export class Pessoa implements IPessoa {
  constructor(
    public id?: number,
    public nome?: string,
    public fotoContentType?: string,
    public foto?: string,
    public dtNascimento?: dayjs.Dayjs | null,
    public cpf?: string | null,
    public ativo?: SimNao | null
  ) {}
}

export function getPessoaIdentifier(pessoa: IPessoa): number | undefined {
  return pessoa.id;
}
