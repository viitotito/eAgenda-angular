import { NgModule, inject } from "@angular/core";
import { EditarCategoriaComponent } from "./editar-categoria/editar-categoria.component";
import { ExcluirCategoriaComponent } from "./excluir-categoria/excluir-categoria.component";
import { InserirCategoriaComponent } from "./inserir-categoria/inserir-categoria.component";
import { ListarCategoriasComponent } from "./listar-categorias/listar-categorias.component";
import { ActivatedRouteSnapshot, ResolveFn, RouterModule, Routes } from "@angular/router";
import { ListarCategoriasViewModel } from "./models/listar-categorias.view-model";
import { CategoriasService } from "./services/categorias.service";
import { FormsCategoriaViewModel } from "./models/forms-categoria.view-model";
import { VisualizarCategoriaViewModel } from "./models/visualizar-categoria.view-model";


const listarCategoriasResolver: ResolveFn<ListarCategoriasViewModel[]> = 
() => {
return inject(CategoriasService).selecionarTodos();
};

const formsCategoriaResolver: ResolveFn<FormsCategoriaViewModel> = 
(route: ActivatedRouteSnapshot) => {
return inject(CategoriasService).selecionarPorId(route.paramMap.get('id')!);
};

const visualizarCategoriaResolver: ResolveFn<VisualizarCategoriaViewModel> = 
(route: ActivatedRouteSnapshot) => {
return inject(CategoriasService).selecionarCategoriaCompletaPorId(route.paramMap.get('id')!);
};

const routes: Routes = [
  {
   path: '',
   redirectTo: 'listar',
   pathMatch: "full",
  },
{
  path: 'listar',
  component: ListarCategoriasComponent,
  resolve: { categorias: listarCategoriasResolver}
},
{
  path: 'inserir',
  component: InserirCategoriaComponent,
},
{
  path: 'editar/:id',
  component: EditarCategoriaComponent,
  resolve: { categoria: formsCategoriaResolver}
},
{
  path: 'excluir/:id',
  component: ExcluirCategoriaComponent,
  resolve: { categoria: visualizarCategoriaResolver}
},

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})

export class CategoriasRoutingModule {}