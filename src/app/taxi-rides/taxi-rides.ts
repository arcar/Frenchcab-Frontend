import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CoursesService, CoursePlanifiee } from '../services/taxi';

@Component({
  imports: [],
  selector: 'app-taxi-rides',
  styleUrl: './taxi-rides.scss',
  templateUrl: './taxi-rides.html',
})

export class TaxiRides implements OnInit {
  constructor(private CoursesServices: CoursesService) {}

  private cdr = inject(ChangeDetectorRef);

  // Planification d'une course
  zones = signal<any[]>([]);
  zoneDepart = '';
  zoneArrivee = '';
  dateCourse = '';
  heureCourse = '';

  // Résultats (signals : l'app est zoneless)
  dureeEstimee = signal<number | null>(null);
  messageErreur = signal('');
  messageSucces = signal('');
  chargement = signal(false);

  // Courses planifiées
  courses: any[] = [];
  // les courses affichées
  coursesAffichees: any[] = [];
  // Numéro de page actuel
  pageActuelle = 1;
  // nombre de ligne affichée
  taillePage = 15;

  ngOnInit() {
    this.CoursesServices.getZones().subscribe((data) => {
      this.zones.set(data);
    });
    this.chargerCourses();
  }

  chargerCourses() {
    this.CoursesServices.getCourses().subscribe({
      next: (data: CoursePlanifiee[]) => {
        this.courses = data;
        this.pageActuelle = 1;
        this.mettreAJourAffichage();
      },
      error: () => this.messageErreur.set('Impossible de charger les courses.'),
    });
  }

  // Vérifie le formulaire ; renvoie la demande ou null
  private lireFormulaire() {
    this.messageErreur.set('');
    if (!this.zoneDepart || !this.zoneArrivee || !this.dateCourse || !this.heureCourse) {
      this.messageErreur.set("Choisis une zone de départ, une zone d'arrivée, une date et une heure.");
      return null;
    }
    if (this.zoneDepart === this.zoneArrivee) {
      this.messageErreur.set("Le départ et l'arrivée doivent être différents.");
      return null;
    }
    return {
      zone_depart: Number(this.zoneDepart),
      zone_arrivee: Number(this.zoneArrivee),
      date: this.dateCourse,
      heure: this.heureCourse,
    };
  }

  // Estimation de durée (sans enregistrer)
  estimerDuree() {
    this.dureeEstimee.set(null);
    this.messageSucces.set('');
    const demande = this.lireFormulaire();
    if (!demande) return;

    this.chargement.set(true);
    this.CoursesServices.estimerDuree(demande).subscribe({
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

  // Réservation : enregistre la course dans la base
  reserver() {
    this.messageSucces.set('');
    const demande = this.lireFormulaire();
    if (!demande) return;

    this.chargement.set(true);
    this.CoursesServices.creerCourse(demande).subscribe({
      next: (course) => {
        this.dureeEstimee.set(course.duree_minutes);
        this.messageSucces.set(`Course n°${course.id} réservée.`);
        this.chargement.set(false);
        this.chargerCourses();
      },
      error: (err) => {
        this.messageErreur.set(err.error?.message || 'Réservation impossible pour le moment.');
        this.chargement.set(false);
      },
    });
  }

    // Annulation d'une course planifiée
  annuler(id: number) {
    this.messageErreur.set('');
    this.messageSucces.set('');

    this.CoursesServices.annulerCourse(id).subscribe({
      next: () => {
        this.messageSucces.set(`Course n°${id} annulée.`);
        // on recharge la liste pour afficher le nouveau statut
        const page = this.pageActuelle;
        this.CoursesServices.getCourses().subscribe((data: CoursePlanifiee[]) => {
          this.courses = data;
          this.pageActuelle = page;
          this.mettreAJourAffichage();
        });
      },
      error: (err) => {
        this.messageErreur.set(err.error?.message || 'Annulation impossible pour le moment.');
      },
    });
  }

  // méthode pour changer de page
  mettreAJourAffichage() {
    const debut = (this.pageActuelle - 1) * this.taillePage;
    const fin = debut + this.taillePage;
    this.coursesAffichees = this.courses.slice(debut, fin);
    // app zoneless : on demande explicitement un nouveau rendu
    this.cdr.markForCheck();
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