import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaxiRides } from './taxi-rides';

// Génère n courses factices
function fausseCourses(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    date_heure: '2026-10-10 10:00',
    zone_depart: 132,
    nom_depart: `Départ ${i + 1}`,
    zone_arrivee: 161,
    nom_arrivee: `Arrivée ${i + 1}`,
    passagers: 1,
    duree_minutes: 30,
    statut: 'planifiee',
  }));
}

describe('TaxiRides', () => {
  let component: TaxiRides;
  let fixture: ComponentFixture<TaxiRides>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiRides],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxiRides);
    component = fixture.componentInstance;
    element = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  // Charge des courses et rafraîchit le rendu
  async function chargerCourses(n: number) {
    component.courses = fausseCourses(n);
    component.mettreAJourAffichage();
    fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function lignes() {
    // la première ligne est l'en-tête
    return element.querySelectorAll('table tr').length - 1;
  }

  function boutons() {
    return element.querySelectorAll('button');
  }

  // Boutons de pagination (les 2 derniers du DOM)
  function boutonsPagination() {
    return Array.from(boutons()).slice(-2);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('état initial', () => {
    it('commence à la page 1 avec 15 lignes par page', () => {
      expect(component.pageActuelle).toBe(1);
      expect(component.taillePage).toBe(15);
    });

    it('affiche un tableau sans courses', () => {
      expect(element.querySelector('table')).toBeTruthy();
      expect(lignes()).toBe(0);
    });

    it("affiche les en-têtes du tableau", () => {
      const entetes = Array.from(element.querySelectorAll('th')).map(th => th.textContent?.trim());
      expect(entetes).toEqual([
        'Départ',
        'Arrivée',
        'Date et heure',
        'Passagers',
        'Durée estimée',
        'Statut',
        'Action',
      ]);
    });
  });

  describe('rendu', () => {
    it("affiche l'image de la bannière avec le bon chemin", () => {
      const img = element.querySelector('img');
      expect(img?.getAttribute('src')).toBe('/image/frenchcab.webp');
    });

    it('affiche les boutons Estimer, Réserver, Precedent et Suivant', () => {
      const textes = Array.from(boutons()).map(b => b.textContent?.trim());
      expect(textes).toEqual(['Estimer la durée', 'Réserver', 'Precedent', 'Suivant']);
    });

    it("affiche le contenu d'une course dans les cellules", async () => {
      await chargerCourses(1);
      const cellules = Array.from(element.querySelectorAll('td')).map(td => td.textContent?.trim());
      expect(cellules).toEqual([
        'Départ 1',
        'Arrivée 1',
        '2026-10-10 10:00',
        '1',
        '30 min',
        'planifiee',
        'Annuler',
      ]);
    });

    it("n'affiche pas le bouton Annuler pour une course annulée", async () => {
      await chargerCourses(1);
      component.courses = [{ ...fausseCourses(1)[0], statut: 'annulee' }];
      component.mettreAJourAffichage();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(element.querySelector('button.annuler')).toBeNull();
    });

    it('affiche au maximum 15 lignes', async () => {
      await chargerCourses(40);
      expect(lignes()).toBe(15);
    });

    it('affiche toutes les courses si moins de 15', async () => {
      await chargerCourses(7);
      expect(lignes()).toBe(7);
    });
  });

  describe('pagination', () => {
    it('pageSuivante affiche les 15 courses suivantes', async () => {
      await chargerCourses(40);
      component.pageSuivante();

      expect(component.pageActuelle).toBe(2);
      expect(component.coursesAffichees.map(c => c.id)).toEqual(
        Array.from({ length: 15 }, (_, i) => i + 16),
      );
    });

    it('la dernière page contient le reste des courses', async () => {
      await chargerCourses(40);
      component.pageSuivante();
      component.pageSuivante();

      expect(component.pageActuelle).toBe(3);
      expect(component.coursesAffichees.length).toBe(10);
    });

    it('pageSuivante ne dépasse pas la dernière page', async () => {
      await chargerCourses(40);
      for (let i = 0; i < 10; i++) component.pageSuivante();

      expect(component.pageActuelle).toBe(3);
      expect(component.coursesAffichees.length).toBe(10);
    });

    it('pageSuivante ne fait rien sans courses', () => {
      component.pageSuivante();
      expect(component.pageActuelle).toBe(1);
    });

    it("pageSuivante ne fait rien avec exactement 15 courses", async () => {
      await chargerCourses(15);
      component.pageSuivante();
      expect(component.pageActuelle).toBe(1);
    });

    it('pagePrecedente revient à la page précédente', async () => {
      await chargerCourses(40);
      component.pageSuivante();
      component.pagePrecedente();

      expect(component.pageActuelle).toBe(1);
      expect(component.coursesAffichees[0].id).toBe(1);
    });

    it('pagePrecedente ne descend pas sous la page 1', () => {
      component.pagePrecedente();
      expect(component.pageActuelle).toBe(1);
    });
  });

  describe('boutons', () => {
    it('le clic sur Suivant puis Precedent met à jour le tableau', async () => {
      await chargerCourses(40);
      const [precedent, suivant] = boutonsPagination();

      suivant.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(element.querySelector('td')?.textContent?.trim()).toBe('Départ 16');

      precedent.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(element.querySelector('td')?.textContent?.trim()).toBe('Départ 1');
    });
  });
});