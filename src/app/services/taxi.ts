import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface DemandeDuree {
    zone_depart: number;
    zone_arrivee: number;
    date: string;
    heure: string;
}

export interface ReponseDuree {
    duree_minutes: number;
    distance_estimee: number;
}

export interface CoursePlanifiee {
    id: number;
    date_heure: string;
    zone_depart: number;
    nom_depart: string;
    zone_arrivee: number;
    nom_arrivee: string;
    passagers: number | null;
    duree_minutes: number | null;
    statut: string;
}

@Service()
export class CoursesService {
    private apiUrl = '/api';
    private http = inject(HttpClient);  

    getZones() {
        return this.http.get<any[]>(`${this.apiUrl}/zones`);
    }

    estimerDuree(demande: DemandeDuree) {
        return this.http.post<ReponseDuree>(`${this.apiUrl}/predictions/duree`, demande);
    }

    creerCourse(demande: DemandeDuree) {
        return this.http.post<any>(`${this.apiUrl}/courses`, demande);
    }

    getCourses() {
        return this.http.get<CoursePlanifiee[]>(`${this.apiUrl}/courses`);
    }

        annulerCourse(id: number) {
        return this.http.patch<{ id: number; statut: string }>(
            `${this.apiUrl}/courses/${id}/annulation`,
            {}
        );
    }
}