export interface IProduto {
  id?: number;
  imagemContentType?: string;
  imagem?: string;
  descricao?: string;
}

export class Produto implements IProduto {
  constructor(public id?: number, public imagemContentType?: string, public imagem?: string, public descricao?: string) {}
}

export function getProdutoIdentifier(produto: IProduto): number | undefined {
  return produto.id;
}
