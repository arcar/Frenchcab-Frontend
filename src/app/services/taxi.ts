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

@Service()
export class CoursesService {
    private apiUrl = 'http://localhost:3000';
    private http = inject(HttpClient);

    getZones() {
        return this.http.get<any[]>(`${this.apiUrl}/zones`);
    }

    estimerDuree(demande: DemandeDuree) {
        return this.http.post<ReponseDuree>(`${this.apiUrl}/predictions/duree`, demande);
    }
}