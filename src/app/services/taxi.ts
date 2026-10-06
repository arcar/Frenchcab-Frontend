import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class CoursesService {

    private apiUrl = 'http://localhost:3000';

    private http = inject(HttpClient);

    getZones() {
        return this.http.get<any[]>(`${this.apiUrl}/zones`);
    }

}