import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PedidoService } from '../service/pedido.service';
import { IPedido, Pedido } from '../pedido.model';
import { IPessoa } from 'app/entities/minicurso/pessoa/pessoa.model';
import { PessoaService } from 'app/entities/minicurso/pessoa/service/pessoa.service';
import { IEndereco } from 'app/entities/minicurso/endereco/endereco.model';
import { EnderecoService } from 'app/entities/minicurso/endereco/service/endereco.service';
import { IProduto } from 'app/entities/minicurso/produto/produto.model';
import { ProdutoService } from 'app/entities/minicurso/produto/service/produto.service';

import { PedidoUpdateComponent } from './pedido-update.component';

describe('Pedido Management Update Component', () => {
  let comp: PedidoUpdateComponent;
  let fixture: ComponentFixture<PedidoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pedidoService: PedidoService;
  let pessoaService: PessoaService;
  let enderecoService: EnderecoService;
  let produtoService: ProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PedidoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PedidoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PedidoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pedidoService = TestBed.inject(PedidoService);
    pessoaService = TestBed.inject(PessoaService);
    enderecoService = TestBed.inject(EnderecoService);
    produtoService = TestBed.inject(ProdutoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Pessoa query and add missing value', () => {
      const pedido: IPedido = { id: 456 };
      const pessoa: IPessoa = { id: 45825 };
      pedido.pessoa = pessoa;

      const pessoaCollection: IPessoa[] = [{ id: 77790 }];
      jest.spyOn(pessoaService, 'query').mockReturnValue(of(new HttpResponse({ body: pessoaCollection })));
      const additionalPessoas = [pessoa];
      const expectedCollection: IPessoa[] = [...additionalPessoas, ...pessoaCollection];
      jest.spyOn(pessoaService, 'addPessoaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(pessoaService.query).toHaveBeenCalled();
      expect(pessoaService.addPessoaToCollectionIfMissing).toHaveBeenCalledWith(pessoaCollection, ...additionalPessoas);
      expect(comp.pessoasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Endereco query and add missing value', () => {
      const pedido: IPedido = { id: 456 };
      const endereco: IEndereco = { id: 77997 };
      pedido.endereco = endereco;

      const enderecoCollection: IEndereco[] = [{ id: 70722 }];
      jest.spyOn(enderecoService, 'query').mockReturnValue(of(new HttpResponse({ body: enderecoCollection })));
      const additionalEnderecos = [endereco];
      const expectedCollection: IEndereco[] = [...additionalEnderecos, ...enderecoCollection];
      jest.spyOn(enderecoService, 'addEnderecoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(enderecoService.query).toHaveBeenCalled();
      expect(enderecoService.addEnderecoToCollectionIfMissing).toHaveBeenCalledWith(enderecoCollection, ...additionalEnderecos);
      expect(comp.enderecosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Produto query and add missing value', () => {
      const pedido: IPedido = { id: 456 };
      const produto: IProduto = { id: 20080 };
      pedido.produto = produto;

      const produtoCollection: IProduto[] = [{ id: 53017 }];
      jest.spyOn(produtoService, 'query').mockReturnValue(of(new HttpResponse({ body: produtoCollection })));
      const additionalProdutos = [produto];
      const expectedCollection: IProduto[] = [...additionalProdutos, ...produtoCollection];
      jest.spyOn(produtoService, 'addProdutoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(produtoService.query).toHaveBeenCalled();
      expect(produtoService.addProdutoToCollectionIfMissing).toHaveBeenCalledWith(produtoCollection, ...additionalProdutos);
      expect(comp.produtosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pedido: IPedido = { id: 456 };
      const pessoa: IPessoa = { id: 46872 };
      pedido.pessoa = pessoa;
      const endereco: IEndereco = { id: 49348 };
      pedido.endereco = endereco;
      const produto: IProduto = { id: 55532 };
      pedido.produto = produto;

      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(pedido));
      expect(comp.pessoasSharedCollection).toContain(pessoa);
      expect(comp.enderecosSharedCollection).toContain(endereco);
      expect(comp.produtosSharedCollection).toContain(produto);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pedido>>();
      const pedido = { id: 123 };
      jest.spyOn(pedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pedido }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(pedidoService.update).toHaveBeenCalledWith(pedido);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pedido>>();
      const pedido = new Pedido();
      jest.spyOn(pedidoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pedido }));
      saveSubject.complete();

      // THEN
      expect(pedidoService.create).toHaveBeenCalledWith(pedido);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Pedido>>();
      const pedido = { id: 123 };
      jest.spyOn(pedidoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pedido });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pedidoService.update).toHaveBeenCalledWith(pedido);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPessoaById', () => {
      it('Should return tracked Pessoa primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPessoaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEnderecoById', () => {
      it('Should return tracked Endereco primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEnderecoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackProdutoById', () => {
      it('Should return tracked Produto primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProdutoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
