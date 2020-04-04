import { Injectable } from '@angular/core';
import { Round } from '../models/round.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
    this.http.get<{ message: string, rounds: any }>('http://localhost:3000/api/rounds')
      .pipe(map((data) => {
        return data.rounds.map(round => {
          return {
            score: round.score,
            course: round.course,
            rating: round.rating,
            slope: round.slope,
            date: round.date,
            id: round._id
          }
        });
      }))
      .subscribe((transformedRounds) => {
        this.rounds = transformedRounds;
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
    this.http.post<{ message: string, roundId: string }>('http://localhost:3000/api/rounds', round)
      .subscribe(data => {
        const id = data.roundId;
        round.id = id;
        this.rounds.push(round);
        this.roundsUpdated.next([...this.rounds]);
      });
  }

  deletePost(roundId: string) {
    this.http.delete('http://localhost:3000/api/rounds/' + roundId)
      .subscribe(() => {
        const updatedRounds = this.rounds.filter(round => round.id !== roundId);
        this.rounds = updatedRounds;
        this.roundsUpdated.next([...this.rounds]);
      });
  }
}
