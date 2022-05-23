import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPedido, Pedido } from '../pedido.model';
import { PedidoService } from '../service/pedido.service';
import { IPessoa } from 'app/entities/minicurso/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/minicurso/pessoa/service/pessoa.service';
import { IEndereco } from 'app/entities/minicurso/endereco/endereco.model';
import { EnderecoService } from 'app/entities/minicurso/endereco/service/endereco.service';
import { IProduto } from 'app/entities/minicurso/produto/produto.model';
import { ProdutoService } from 'app/entities/minicurso/produto/service/produto.service';

@Component({
  selector: 'jhi-pedido-update',
  templateUrl: './pedido-update.component.html',
})
export class PedidoUpdateComponent implements OnInit {
  isSaving = false;

  pessoasSharedCollection: IPessoa[] = [];
  enderecosSharedCollection: IEndereco[] = [];
  produtosSharedCollection: IProduto[] = [];

  editForm = this.fb.group({
    id: [],
    entregue: [],
    dtEntrega: [],
    pessoa: [null, Validators.required],
    endereco: [null, Validators.required],
    produto: [null, Validators.required],
  });

  constructor(
    protected pedidoService: PedidoService,
    protected pessoaService: PessoaService,
    protected enderecoService: EnderecoService,
    protected produtoService: ProdutoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pedido }) => {
      if (pedido.id === undefined) {
        const today = dayjs().startOf('day');
        pedido.dtEntrega = today;
      }

      this.updateForm(pedido);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pedido = this.createFromForm();
    if (pedido.id !== undefined) {
      this.subscribeToSaveResponse(this.pedidoService.update(pedido));
    } else {
      this.subscribeToSaveResponse(this.pedidoService.create(pedido));
    }
  }

  trackPessoaById(_index: number, item: IPessoa): number {
    return item.id!;
  }

  trackEnderecoById(_index: number, item: IEndereco): number {
    return item.id!;
  }

  trackProdutoById(_index: number, item: IProduto): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPedido>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(pedido: IPedido): void {
    this.editForm.patchValue({
      id: pedido.id,
      entregue: pedido.entregue,
      dtEntrega: pedido.dtEntrega ? pedido.dtEntrega.format(DATE_TIME_FORMAT) : null,
      pessoa: pedido.pessoa,
      endereco: pedido.endereco,
      produto: pedido.produto,
    });

    this.pessoasSharedCollection = this.pessoaService.addPessoaToCollectionIfMissing(this.pessoasSharedCollection, pedido.pessoa);
    this.enderecosSharedCollection = this.enderecoService.addEnderecoToCollectionIfMissing(this.enderecosSharedCollection, pedido.endereco);
    this.produtosSharedCollection = this.produtoService.addProdutoToCollectionIfMissing(this.produtosSharedCollection, pedido.produto);
  }

  protected loadRelationshipsOptions(): void {
    this.pessoaService
      .query()
      .pipe(map((res: HttpResponse<IPessoa[]>) => res.body ?? []))
      .pipe(map((pessoas: IPessoa[]) => this.pessoaService.addPessoaToCollectionIfMissing(pessoas, this.editForm.get('pessoa')!.value)))
      .subscribe((pessoas: IPessoa[]) => (this.pessoasSharedCollection = pessoas));

    this.enderecoService
      .query()
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing(enderecos, this.editForm.get('endereco')!.value)
        )
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosSharedCollection = enderecos));

    this.produtoService
      .query()
      .pipe(map((res: HttpResponse<IProduto[]>) => res.body ?? []))
      .pipe(
        map((produtos: IProduto[]) => this.produtoService.addProdutoToCollectionIfMissing(produtos, this.editForm.get('produto')!.value))
      )
      .subscribe((produtos: IProduto[]) => (this.produtosSharedCollection = produtos));
  }

  protected createFromForm(): IPedido {
    return {
      ...new Pedido(),
      id: this.editForm.get(['id'])!.value,
      entregue: this.editForm.get(['entregue'])!.value,
      dtEntrega: this.editForm.get(['dtEntrega'])!.value ? dayjs(this.editForm.get(['dtEntrega'])!.value, DATE_TIME_FORMAT) : undefined,
      pessoa: this.editForm.get(['pessoa'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
      produto: this.editForm.get(['produto'])!.value,
    };
  }
}
