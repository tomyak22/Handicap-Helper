import { Injectable } from '@angular/core';
import { Round } from '../models/round.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoundsService {
  private rounds: Round[] = [];
  private roundsUpdated = new Subject<Round[]>();

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Returns the updated rounds as an observable
   */
  getRoundsUpdateListener() {
    return this.roundsUpdated.asObservable();
  }

  /**
   * Gets all the rounds from the api on port 3000
   */
  getRounds() {
    this.http.get<{ message: string, rounds: Round[] }>('http://localhost:3000/api/rounds')
      .subscribe((data) => {
        this.rounds = data.rounds;
        this.roundsUpdated.next([...this.rounds]);
      });
  }

  /**
   * Add a round to the local api running on node
   */
  addRound(score: number, course: string, rating: number, slope: number, date: string) {
    const round: Round = {
      id: null,
      score: score,
      course: course,
      rating: rating,
      slope: slope,
      date: date
    };
    this.http.post<{ message: string }>('http://localhost:3000/api/rounds', round)
      .subscribe(data => {
        console.log(data.message);
        this.rounds.push(round);
        this.roundsUpdated.next([...this.rounds]);
      });
  }
}
