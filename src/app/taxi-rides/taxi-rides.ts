import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../services/taxi';

@Component({
  imports: [],
  selector: 'app-taxi-rides',
  styleUrl: './taxi-rides.scss',
  templateUrl: './taxi-rides.html',
})

export class TaxiRides implements OnInit {
  constructor(private CoursesServices: CoursesService) {}

  // Récupération des courses du JSON
  courses: any[] = [];
  // les courses affichées
  coursesAffichees: any[] = [];
  // Numéro de page actuel
  pageActuelle = 1;
  // nombre de ligne affichée
  taillePage = 15;

  // liste des zones (GET /zones)
  zones: any[] = [];
  // zones choisies par l'utilisateur
  zoneDepart = '';
  zoneArrivee = '';
  dateCourse = '';
  heureCourse = '';

  ngOnInit() {
    this.CoursesServices.getZones().subscribe((data) => {
      this.zones = data;
    });
  }

  // méthode pour changer de page
  mettreAJourAffichage() {
    const debut = (this.pageActuelle - 1) * this.taillePage;
    const fin = debut + this.taillePage;
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