import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListarDespesasViewModel } from '../models/listar-despesas.view-model';
import { FormsDespesaViewModel } from '../models/forms-despesa.view-model';
import { VisualizarDespesaViewModel } from '../models/visualizar-despesa.view-model';

@Injectable()
export class DespesasService {
  private endpoint: string =
    'https://e-agenda-web-api.onrender.com/api/despesas/';

  constructor(private http: HttpClient) { }


  public inserir(
    despesa: FormsDespesaViewModel
  ): Observable<FormsDespesaViewModel> {
    return this.http
    .post<any>(this.endpoint, despesa, this.obterHeadersAutorizacao())
    .pipe(
      map((res) => res.dados),
      catchError((err: HttpErrorResponse) => this.processarErroHttp(err))
    );
  }
  public editar(
    id: string,
    despesa: FormsDespesaViewModel
  ): Observable<FormsDespesaViewModel> {
    return this.http
      .put<any>(this.endpoint + id, despesa, this.obterHeadersAutorizacao())
      .pipe(map((res) => res.dados));
  }

  public excluir(id: string): Observable<any> {
    return this.http.delete(this.endpoint + id, this.obterHeadersAutorizacao())
    .pipe(
      catchError((err: HttpErrorResponse) => this.processarErroHttp(err))
    );
  }
  
  public selecionarPorId(id: string): Observable<FormsDespesaViewModel> {
    return this.http
      .get<any>(this.endpoint + id, this.obterHeadersAutorizacao())
      .pipe(
        map((res) => res.dados),
        catchError((err: HttpErrorResponse) => this.processarErroHttp(err))
      );
      }

      public selecionarDespesaCompletaPorId(
        id: string
      ): Observable<VisualizarDespesaViewModel> {
        return this.http
          .get<any>(
            this.endpoint + 'visualizacao-completa/' + id,
            this.obterHeadersAutorizacao()
          )
          .pipe(
            map((res) => res.dados),
            catchError((err: HttpErrorResponse) => this.processarErroHttp(err))
          );
      }

  public selecionarTodos(): Observable<ListarDespesasViewModel[]> {
    return this.http
      .get<any>(this.endpoint, this.obterHeadersAutorizacao())
      .pipe(
        map((res) => res.dados),
        catchError((err: HttpErrorResponse) => this.processarErroHttp(err))
      );
  }



  
  private obterHeadersAutorizacao() {
    const token = environment.key;

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }
  private processarErroHttp(erro: HttpErrorResponse){
    let mensagemErro = '';

    if (erro.status == 0)
      mensagemErro = 'Ocorreu um erro ao processar a requisição.';
    if (erro.status == 401)
      mensagemErro = 'O usuário não está autorizado. Efetue login e tente novamente.';
    else mensagemErro = erro.error?.erros[0];

    return throwError(() => new Error(mensagemErro));
  }
}
