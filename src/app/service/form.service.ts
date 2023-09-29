import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormData, SectorData, SectorItem} from '../model/form-data.model';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private baseUrl = 'http://localhost:8080/api/form';

  constructor(private http: HttpClient) {
  }

  getDataFromBackend(): Observable<SectorData> {
    return this.http.get<SectorData>(`${this.baseUrl}/data`);
  }

  submitFormData(formData: FormData): Observable<FormData> {
    return this.http.post<FormData>(`${this.baseUrl}/submit`, formData);
  }
}
