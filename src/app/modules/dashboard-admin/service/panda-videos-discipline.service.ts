import { HttpClient, HttpEvent } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PandaVideoDisciplineService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/disciplines-chapter-classes`;

  getTusUrl(fileName: string, size: number, disciplineId: string) {
    return this.#http.post<{ upload_url: string }>(
      `${this.#apiUrl}/get-panda-upload-url`,
      {
        fileName,
        fileSize: size,
        disciplineId,
      },
    );
  }

  uploadWithTus(uploadUrl: string, file: File) {
    return this.#http.patch(uploadUrl, file, {
      headers: {
        'Tus-Resumable': '1.0.0',
        'Upload-Offset': '0',
        'Content-Type': 'application/offset+octet-stream',
      },
      reportProgress: true,
      observe: 'events',
    });
  }

  public deleteFile(video_id: string): Observable<HttpEvent<any>> {
    return this.#http.delete<any>(`${this.#apiUrl}/upload-delete/${video_id}`);
  }
}
