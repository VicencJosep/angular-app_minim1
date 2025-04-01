import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Historial } from '../models/historial.model';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  constructor(private http: HttpClient) { }

  private apiUrl = "http://localhost:4000/api/historiales";
  añadirHistorial(credentials: { fecha: string; packet: string[];user_nuevo: string; user_antiguo:string[] }): Observable<any>
  {
    console.log("credentials:",credentials);
    return this.http.post(this.apiUrl, credentials);
  }
  getHistoriales(page: number = 1, limit: number = 3): Observable<{ data: Historial[]; totalUsers: number; currentPage: number }> {
      return this.http.get<{ data: Historial[]; totalUsers: number; currentPage: number }>(
        `${this.apiUrl}?page=${page}&limit=${limit}`
      );
    }
}
