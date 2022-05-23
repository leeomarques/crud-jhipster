import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'pessoa',
        data: { pageTitle: 'gatewayMiniCursoApp.minicursoPessoa.home.title' },
        loadChildren: () => import('./minicurso/pessoa/pessoa.module').then(m => m.MinicursoPessoaModule),
      },
      {
        path: 'endereco',
        data: { pageTitle: 'gatewayMiniCursoApp.minicursoEndereco.home.title' },
        loadChildren: () => import('./minicurso/endereco/endereco.module').then(m => m.MinicursoEnderecoModule),
      },
      {
        path: 'produto',
        data: { pageTitle: 'gatewayMiniCursoApp.minicursoProduto.home.title' },
        loadChildren: () => import('./minicurso/produto/produto.module').then(m => m.MinicursoProdutoModule),
      },
      {
        path: 'pedido',
        data: { pageTitle: 'gatewayMiniCursoApp.minicursoPedido.home.title' },
        loadChildren: () => import('./minicurso/pedido/pedido.module').then(m => m.MinicursoPedidoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
