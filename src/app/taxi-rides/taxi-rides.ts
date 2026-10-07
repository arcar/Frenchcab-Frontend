import { Component, OnInit, signal } from '@angular/core';
import { CoursesService } from '../services/taxi';

@Component({
  imports: [],
  selector: 'app-taxi-rides',
  styleUrl: './taxi-rides.scss',
  templateUrl: './taxi-rides.html',
})

export class TaxiRides implements OnInit {
  constructor(private CoursesServices: CoursesService) {}

  // Planification d'une course
  zones = signal<any[]>([]);
  zoneDepart = '';
  zoneArrivee = '';
  dateCourse = '';
  heureCourse = '';

  // Résultat de l'estimation (signals : l'app est zoneless)
  dureeEstimee = signal<number | null>(null);
  messageErreur = signal('');
  chargement = signal(false);

  ngOnInit() {
    this.CoursesServices.getZones().subscribe((data) => {
      this.zones.set(data);
    });
  }

  // Demande l'estimation de durée au back (via la gateway)
  estimerDuree() {
    this.dureeEstimee.set(null);
    this.messageErreur.set('');

    if (!this.zoneDepart || !this.zoneArrivee || !this.dateCourse || !this.heureCourse) {
      this.messageErreur.set('Choisis une zone de départ, une zone d\'arrivée, une date et une heure.');
      return;
    }

    this.chargement.set(true);
    this.CoursesServices.estimerDuree({
      zone_depart: Number(this.zoneDepart),
      zone_arrivee: Number(this.zoneArrivee),
      date: this.dateCourse,
      heure: this.heureCourse,
    }).subscribe({
      next: (reponse) => {
        this.dureeEstimee.set(reponse.duree_minutes);
        this.chargement.set(false);
      },
      error: (err) => {
        this.messageErreur.set(err.error?.message || 'Estimation impossible pour le moment.');
        this.chargement.set(false);
      },
    });
  }

  // Récupération des courses du JSON
  courses: any[] = [];
  // les courses affichées
  coursesAffichees: any[] = [];
  // Numéro de page actuel
  pageActuelle = 1;
  // nombre de ligne affichée
  taillePage = 15;

  // méthode pour changer de page
  mettreAJourAffichage() {
    const debut = (this.pageActuelle - 1) * this.taillePage;
    const fin = debut + this.taillePage
    this.coursesAffichees = this.courses.slice(debut, fin);
  }
  // passer à la page suivante
  pageSuivante() {
    if (this.pageActuelle * this.taillePage >= this.courses.length) return;
    this.pageActuelle++;
    this.mettreAJourAffichage();
  }
  // retrouner à la page précédente
  pagePrecedente() {
    if (this.pageActuelle <= 1) return;
    this.pageActuelle--;
    this.mettreAJourAffichage();
  }
}