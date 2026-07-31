import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PdfDownloadRequest {
  pdfUrl: string;
  userEmail: string;
  userName?: string; // Nome do usuário (opcional)
}

@Injectable({
  providedIn: 'root',
})
export class PdfWatermarkService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pdf-watermark`;

  /**
   * Baixa PDF com marca d'água aplicada
   */
  downloadPdfWithWatermark(request: PdfDownloadRequest): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/download`, request, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Verifica se o serviço está funcionando
   */
  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  /**
   * Helper para fazer download do blob como arquivo
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
