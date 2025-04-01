import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Packet } from '../models/packet.model';
import { PacketService } from '../services/packet.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { User } from '../models/user.model';
import { HistorialService } from '../services/historial.service';

@Component({
  selector: 'app-packet',
  imports: [CommonModule, MatPaginatorModule, FormsModule],
  templateUrl: './packet.component.html',
  styleUrl: './packet.component.css'
})
export class PacketComponent implements OnInit{
  searchTerm: string = ''; // Término de búsqueda
  mostrarModal: boolean = false; // Controla la visibilidad del modal
  packetsList: Packet[] = []; // Lista completa de pacquetes
  displayedPackets: Packet[] = []; // Paquetes visibles en la página actual    totalItems = 0; // Número total de elementos
  totalItems = 0; // Número total de elementos
  itemsPerPage = 3; // Elementos por página
  currentPage = 0; // Página actual
  paquetesSeleccionados: Packet[] = []; // Almacena los paquetes del usuario seleccionado
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.obtainPackets();
  }
  packetService = inject(PacketService);
  userService = inject(UserService);
  historialService = inject(HistorialService);

  obtainPackets(): void {
    this.packetService.getPackets(this.currentPage + 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.packetsList = response.data.map(packet => ({
          ...packet
        }));
        this.displayedPackets = this.packetsList; // Actualiza los paquetes mostrados
        this.totalItems = response.totalPackets;
        console.log(this.packetsList, this.totalItems);
        this.cdr.detectChanges();
        if (this.packetsList.length > 0) {
          console.log(this.packetsList[0].name); // Ahora no dará error
        }
      },
      error: (error) => {
        console.error('Error al obtener paquetes:', error);
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.obtainPackets(); // Llama a la función para obtener los paquetes de la nueva página
  }

  trackByPacketId(index: number, packet: any): string {
    return packet?._id || index.toString(); // Asegura que siempre se devuelva un valor válido
  }

  toggleSeleccion(packet: Packet): void {
    packet.seleccionado = !packet.seleccionado;
    console.log(packet.seleccionado);
  }

  confirmarAsignacion(): void {
    this.paquetesSeleccionados = this.packetsList.filter(packet => packet.seleccionado); // Filtra los usuarios seleccionados
    console.log('Usuarios seleccionados:', this.paquetesSeleccionados);
    if (this.paquetesSeleccionados.length === 0) {
      alert('No hay paquetes seleccionados para asignar.');
      return;
    }
    this.mostrarModal = true; // Muestra el modal
  }

  search() {
    console.log(this.searchTerm);

    // Obtener la lista de usuarios
    this.userService.getUsers().subscribe({
      next: (response) => {
        const users: User[] = response.data; // Extraer el array de usuarios
        console.log('Lista de usuarios:', users);

        // Procesar los paquetes seleccionados de forma síncrona
        const paquetesSinUsuario: Packet[] = [];

        this.paquetesSeleccionados.forEach(packet => {
          // Encuentra todos los usuarios que tienen asignado este paquete
          const usuarios = users.filter(user => user.packets.includes(packet._id));
          
          if (usuarios.length > 0) {
            // Crear una lista de nombres de usuarios antiguos
            const usuariosAntiguos = usuarios.map(usuario => usuario.name);

            console.log(`✅ El paquete con ID ${packet._id} pertenece a los usuarios: ${usuariosAntiguos.join(', ')}`);

            // Registrar en el historial
            this.historialService.añadirHistorial({
              fecha: new Date().toISOString(),
              packet: [packet._id],
              user_nuevo: this.searchTerm,
              user_antiguo: usuariosAntiguos // Enviar la lista de nombres de usuarios antiguos
            }).subscribe({
              next: () => {
                console.log(`Historial actualizado para el paquete ${packet._id}`);
              },
              error: (error) => {
                console.error(`Error al actualizar el historial para el paquete ${packet._id}:`, error);
              }
            });
          } else {
            console.log(`❌ El paquete con ID ${packet._id} no tiene un usuario asignado.`);
            paquetesSinUsuario.push(packet);
          }
        });

        // Asignar los paquetes seleccionados al nuevo usuario
        this.asignarPaquetesAlUsuario();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
  }

  private asignarPaquetesAlUsuario(): void {
    const asignaciones = this.paquetesSeleccionados.map(packet => {
      return this.userService.assignPacketsToUser(this.searchTerm, packet._id).toPromise();
    });

    Promise.all(asignaciones)
      .then((responses) => {
        console.log('Todos los paquetes han sido asignados:', responses);
        alert('Todos los paquetes han sido asignados correctamente.');
        this.mostrarModal = false; // Oculta el modal
      })
      .catch((error) => {
        console.error('Error al asignar paquetes:', error);
        alert('Ocurrió un error al asignar algunos paquetes.');
      });
  }
}
