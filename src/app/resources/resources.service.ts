import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { IResourceGetAllQueryResult, IResourceGetQueryResult } from "./resource";

@Injectable({
    providedIn: 'root'
  })

  export class ResourcesService 
  {
    constructor(private http: HttpClient) {

     }

     private resourcesUrl = 'https://localhost:44359/api/Resource/';
     private bookUrl = 'https://localhost:44359/api/Booking/book';

     getResources(): Observable<any> {
        return this.http.get<any>(this.resourcesUrl+'GetAll')
        .pipe(
            tap(data => console.log('All: ', JSON.stringify(data))),
            catchError(this.handleError)
          );
      }
    

      getResource(id: number): Observable<any> {
        return this.http.get<any>(this.resourcesUrl+id)
        .pipe(catchError(this.handleError));
      }

      book(bookCommand:any): Observable<any>{
        return this.http.put<any>(this.bookUrl,bookCommand);
      }

     private handleError(err: HttpErrorResponse): Observable<never> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          errorMessage = `An error occurred: ${err.error.message}`;
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      }
  }