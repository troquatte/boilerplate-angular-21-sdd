import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IStructureCoursesHowToStudyTutorialEntity } from '../../../../server/modules/structure-how-to-study-tutorial/interface/IStructureCoursesHowToStudyTutorialEntity.interface';

@Injectable({
  providedIn: 'root',
})
export class StructureHowToStudyTutorialsService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/structure-how-to-study-tutorial`;

  public create$(
    payload: Omit<
      IStructureCoursesHowToStudyTutorialEntity,
      'createdAt' | 'updatedAt' | 'structure_id' | 'course_id'
    >,
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
  ): Observable<IStructureCoursesHowToStudyTutorialEntity> {
    return this.#http
      .post<{
        data: IStructureCoursesHowToStudyTutorialEntity;
      }>(`${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}`, {
        ...payload,
      })
      .pipe(this.#refreshAfterChange());
  }

  public read$(
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
    how_to_study_tutorial_id: string,
  ): Observable<IStructureCoursesHowToStudyTutorialEntity> {
    return this.#http
      .get<{
        data: IStructureCoursesHowToStudyTutorialEntity;
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}/${how_to_study_tutorial_id}`,
      )
      .pipe(this.#refreshAfterChange());
  }

  public list$(
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
  ): Observable<Array<IStructureCoursesHowToStudyTutorialEntity>> {
    return this.#http
      .get<{
        data: Array<IStructureCoursesHowToStudyTutorialEntity>;
      }>(`${this.#apiUrl}/list/${structure_id}/${course_id}/${how_to_study_id}`)
      .pipe(map((res) => res.data));
  }

  public update$(
    payload: Omit<
      IStructureCoursesHowToStudyTutorialEntity,
      'createdAt' | 'updatedAt' | 'structure_id' | 'course_id'
    >,
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
    how_to_study_tutorial_id: string,
  ): Observable<IStructureCoursesHowToStudyTutorialEntity> {
    return this.#http
      .put<{
        data: IStructureCoursesHowToStudyTutorialEntity;
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}/${how_to_study_tutorial_id}`,
        {
          ...payload,
        },
      )
      .pipe(this.#refreshAfterChange());
  }

  public delete$(
    structure_id: string,
    course_id: string,
    how_to_study_id: string,
    how_to_study_tutorial_id: string,
  ): Observable<Array<IStructureCoursesHowToStudyTutorialEntity>> {
    return this.#http
      .delete<{
        data: Array<IStructureCoursesHowToStudyTutorialEntity>;
      }>(
        `${this.#apiUrl}/${structure_id}/${course_id}/${how_to_study_id}/${how_to_study_tutorial_id}`,
      )
      .pipe(map((res) => res.data));
  }

  public listVideos$(how_to_study_tutorial_id: string) {
    return this.#http
      .get<{
        data: any;
      }>(`${this.#apiUrl}/list-videos/${how_to_study_tutorial_id}`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  #refreshAfterChange<T>() {
    return (source$: Observable<{ data: T }>): Observable<T> => {
      return source$.pipe(
        map((res) => res.data),
        catchError((error: HttpErrorResponse) => throwError(() => error)),
      );
    };
  }
}
