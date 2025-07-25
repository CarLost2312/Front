// main.component.ts (NO CAMBIOS MAYORES PARA ESTA SOLICITUD)
import { Component, OnInit } from '@angular/core';
import { DCadleService } from '../../../Services/DCadle/dcadle.service';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, NgClass],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  constructor(private serviciopersonaje: DCadleService) { }

  personajes: any[] = [];
  personajeSeleccionado: any = null;
  personajeObjetivo: any | null = null;
  personajesDisponibles: any[] = [];
  intentos: any[] = [];
  atributosAMostrar: { nombre: string, valorDisplay: any, valorOriginal: any }[] = [];
  nombreBusqueda: string = '';
  resultadosFiltrados: any[] = [];
  mostrarSugerencias: boolean = false;


  ngOnInit(): void {
    this.obtenerPersonajes();
  }

  obtenerPersonajes(): void {
    this.serviciopersonaje.getPersonaje().subscribe({
      next: (res) => {
        this.personajes = res;
        console.log('Personajes cargados:', this.personajes);
        this.seleccionarPersonajeObjetivoAleatorio();
        this.personajesDisponibles = [...this.personajes];
      },
      error: (err) => {
        console.error('Error al obtener personajes', err);
      }
    });
  }

  seleccionarPersonaje(personaje: any): void {
    this.personajeSeleccionado = personaje;
    this.nombreBusqueda = personaje.nombre;
    this.resultadosFiltrados = [];
    this.mostrarSugerencias = false;
    this.atributosAMostrar = [];
  }

  ocultarResultadosConDelay(): void {
    setTimeout(() => {
      this.mostrarSugerencias = false;
    }, 150);
  }

  seleccionarPersonajeObjetivoAleatorio(): void {
    if (this.personajes.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.personajes.length);
      this.personajeObjetivo = this.personajes[randomIndex];
      console.log('Personaje objetivo :', this.personajeObjetivo.nombre);
    } else {
      console.warn('No hay personajes para seleccionar como objetivo.');
    }
  }

  enviarPersonaje(): void {
    if (!this.personajeSeleccionado) {
      alert('Por favor, selecciona un personaje antes de enviar.');
      return;
    }

    if (!this.personajeObjetivo) {
      console.error('No se ha definido un personaje objetivo. No se puede comparar.');
      return;
    }

    const atributosAConsiderar = [
      'genero',
      'rol',
      'origen',
      'especie',
      'equipo',
      'poderes'
    ];

    if (this.personajeSeleccionado._id === this.personajeObjetivo._id) {
      const modalElement = document.getElementById('successModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      const atributosComparados = atributosAConsiderar.map(attr => {
        const valorSeleccionado = this.personajeSeleccionado[attr];
        const valorDisplay = Array.isArray(valorSeleccionado)
          ? valorSeleccionado.join(', ')
          : valorSeleccionado;
           console.log("Cualidades: ",valorDisplay)
          

        return {
          nombre: this.capitalizeFirstLetter(attr),
          valorDisplay,
         
          valorOriginal: valorSeleccionado,
       
        };
      });

      this.intentos.unshift({
        ...this.personajeSeleccionado,
        atributosComparados
      });

      this.personajesDisponibles = this.personajesDisponibles.filter(
        p => p._id !== this.personajeSeleccionado._id
      );

      this.personajeSeleccionado = null;
      this.nombreBusqueda = '';
      this.resultadosFiltrados = [];
      this.mostrarSugerencias = false;
    }
  }

  capitalizeFirstLetter(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

reiniciarJuego(): void {
  this.personajeSeleccionado = null;
  this.atributosAMostrar = [];
  this.intentos = [];
  this.nombreBusqueda = '';
  this.resultadosFiltrados = [];
  this.mostrarSugerencias = false;

  // Pequeño delay para evitar que se muestre el nuevo personaje fugazmente
  setTimeout(() => {
    this.obtenerPersonajes(); // carga el nuevo personaje objetivo
  }, 100); // 100 ms suele ser suficiente (podés ajustar a 50 si querés)
}

getColor(attr: string, valorIntento: any): string {
  const valorObjetivo = this.personajeObjetivo ? this.personajeObjetivo[attr] : null;

  if (valorObjetivo === null || valorIntento === undefined) {
    return 'bg-secondary';
  }

  // Para arrays (poderes, equipo, especie)
  if (Array.isArray(valorIntento) && Array.isArray(valorObjetivo)) {
    const filteredIntento = valorIntento.filter((item: string) => item.toLowerCase() !== 'ninguno' && item !== '');
    const filteredObjetivo = valorObjetivo.filter((item: string) => item.toLowerCase() !== 'ninguno' && item !== '');

    if (filteredIntento.length === 0 && filteredObjetivo.length === 0) {
      return 'bg-success';
    }

    const allMatch = filteredIntento.length === filteredObjetivo.length &&
      filteredIntento.every((item: string) => filteredObjetivo.includes(item));
    const anyMatch = filteredIntento.some((item: string) => filteredObjetivo.includes(item));

    if (allMatch) {
      return 'bg-success';
    } else if (anyMatch) {
      return 'bg-warning';
    } else {
      return 'bg-danger';
    }
  }

  // Comparación directa
  return valorIntento === valorObjetivo ? 'bg-success' : 'bg-danger';
}

  filtrarPersonajes(): void {
    const termino = this.nombreBusqueda.toLowerCase().trim();
    if (termino.length === 0) {
      this.resultadosFiltrados = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.resultadosFiltrados = this.personajesDisponibles.filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );

    this.mostrarSugerencias = true;
  }
}