import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private apiUrl = 'https://localhost:7084/api/Category';

    constructor(private http: HttpClient) { }

    getAllCategories(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }


}
