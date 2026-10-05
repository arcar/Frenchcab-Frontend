import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxiRides } from './taxi-rides';

// Génère n courses factices
function fausseCourses(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    localisation_d: `Départ ${i + 1}`,
    localisation_a: `Arrivée ${i + 1}`,
    heure_d: '10:00',
    heure_a: '10:30',
    duree: '30 min',
  }));
}

describe('TaxiRides', () => {
  let component: TaxiRides;
  let fixture: ComponentFixture<TaxiRides>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxiRides],
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
        'Localisation de départ',
        "Localisation d'arrivée",
        'Heure de départ',
        "Heure d'arrivée",
        'Durée de la course',
      ]);
    });
  });

  describe('rendu', () => {
    it("affiche l'image de la bannière avec le bon chemin", () => {
      const img = element.querySelector('img');
      expect(img?.getAttribute('src')).toBe('/image/frenchcab.webp');
    });

    it('affiche les boutons Precedent et Suivant', () => {
      const textes = Array.from(boutons()).map(b => b.textContent?.trim());
      expect(textes).toEqual(['Precedent', 'Suivant']);
    });

    it("affiche le contenu d'une course dans les cellules", async () => {
      await chargerCourses(1);
      const cellules = Array.from(element.querySelectorAll('td')).map(td => td.textContent?.trim());
      expect(cellules).toEqual(['Départ 1', 'Arrivée 1', '10:00', '10:30', '30 min']);
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
      const [precedent, suivant] = Array.from(boutons());

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
