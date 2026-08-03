import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PandaVideoHowToStudyService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-how-to-study-tutorial`;

  public uploadFile(
    disciplines_id: string,
    file: File,
    onProgress: (percent: number) => void,
  ): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.#http.post(
      `${this.#apiUrl}/upload/${disciplines_id}`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    );
  }

  public deleteFile(video_id: string): Observable<HttpEvent<any>> {
    return this.#http.delete<any>(`${this.#apiUrl}/upload-delete/${video_id}`);
  }
}
