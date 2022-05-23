import { IPessoa } from 'app/entities/minicurso/pessoa/pessoa.model';

export interface IEndereco {
  id?: number;
  rua?: string;
  cidade?: string;
  bairro?: string;
  pessoa?: IPessoa;
}

export class Endereco implements IEndereco {
  constructor(public id?: number, public rua?: string, public cidade?: string, public bairro?: string, public pessoa?: IPessoa) {}
}

export function getEnderecoIdentifier(endereco: IEndereco): number | undefined {
  return endereco.id;
}
