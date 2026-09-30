import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-taxi-rides',
  styleUrl: './taxi-rides.scss',
  templateUrl: './taxi-rides.html',
})

export class TaxiRides {
  // Récupération des courses du JSON
  courses = [];
  // les courses affichées
  coursesAffichees = [];
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
    this.pageActuelle++;
    this.mettreAJourAffichage();
  }
  // retrouner à la page précédente
  pagePrecedente() {
    this.pageActuelle--;
    this.mettreAJourAffichage();
  }
}