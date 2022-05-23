import dayjs from 'dayjs/esm';
import { IPessoa } from 'app/entities/minicurso/pessoa/pessoa.model';
import { IEndereco } from 'app/entities/minicurso/endereco/endereco.model';
import { IProduto } from 'app/entities/minicurso/produto/produto.model';

export interface IPedido {
  id?: number;
  entregue?: boolean | null;
  dtEntrega?: dayjs.Dayjs | null;
  pessoa?: IPessoa;
  endereco?: IEndereco;
  produto?: IProduto;
}

export class Pedido implements IPedido {
  constructor(
    public id?: number,
    public entregue?: boolean | null,
    public dtEntrega?: dayjs.Dayjs | null,
    public pessoa?: IPessoa,
    public endereco?: IEndereco,
    public produto?: IProduto
  ) {
    this.entregue = this.entregue ?? false;
  }
}

export function getPedidoIdentifier(pedido: IPedido): number | undefined {
  return pedido.id;
}
