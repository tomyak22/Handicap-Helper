import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HandicapService {
  private handicapWasUpdatedSubject = new Subject<void>();
  public handicapWasUpdated$: Observable<void> = this.handicapWasUpdatedSubject;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  getHandicap(): Observable<number> {
    return this.http.get < { handicap: number } >('http://localhost:3000/api/user/handicap')
      .pipe(map((data) => {
        return data.handicap;
      }));
  }

  updateHandicap(handicap: number) {
    return this.http.put('http://localhost:3000/api/user/handicap', {handicap});
  }
}
