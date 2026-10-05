import { Service } from '@angular/core';

@Service()
export class CoursesService {

    private apiUrl = 'http://localhost:3000';

    constructor(/* HttpClient ici */) {}

    getArticles() {
        // appel vers ton backend
    }

}