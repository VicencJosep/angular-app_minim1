import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HistorialService } from '../services/historial.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  imports: [CommonModule, MatPaginatorModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {
  historialList: any[] = []; // Lista completa del historial
  displayedHistorial: any[] = []; // Historial visible en la página actual
  totalItems = 0; // Número total de elementos
  itemsPerPage = 5; // Elementos por página
  currentPage = 0; // Página actual

  historialService = inject(HistorialService);
  cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.obtenerHistorial();
  }
  trackByHistorialId(index: number, item: any): string {
    return item?._id || index.toString();
  }
  

  obtenerHistorial(): void {
    this.historialService.getHistoriales().subscribe({
      next: (response) => {
        this.historialList = response.data.map(historial => ({ ...historial }));
        this.displayedHistorial = this.historialList.slice(0, this.itemsPerPage);
        
        this.totalItems = response.totalUsers; // Total de elementos
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener historial:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    const startIndex = this.currentPage * this.itemsPerPage;
    this.displayedHistorial = this.historialList.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
