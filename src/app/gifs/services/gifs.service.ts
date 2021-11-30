import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  // La siguiente propiedad le permite a Angular indicar que el servicio es unico y de manera global y no se tiene que especificar en el modulo como provider
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'SFJZibLk3yqlfWRImjeoW6sUXSSuY9OI';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(busqueda: string = ''): void {
    if (busqueda.trim().length === 0) {
      return;
    }

    busqueda = busqueda.trim().toUpperCase();
    if (!this._historial.includes(busqueda)) {
      this._historial.unshift(busqueda);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    console.log(this._historial);

    /* this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=${this.apiKey}&q=${busqueda}&limit=10&lang=es`)
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      }); */

    const params = new HttpParams().set('api_key', this.apiKey).set('limit', '10').set('lang', 'es').set('q', busqueda);
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
      .subscribe((resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
