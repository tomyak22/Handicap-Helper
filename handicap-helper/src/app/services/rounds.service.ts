import { Injectable } from '@angular/core';
import { Round } from '../models/round.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoundsService {
  private rounds: Round[] = [];
  private roundsUpdated = new Subject<{rounds: Round[], roundsCount: number}>();

  constructor(
    private http: HttpClient,
    private router: Router
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
  getRounds(roundsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${roundsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, rounds: any, maxRounds: number }>('http://localhost:3000/api/rounds' + queryParams)
      .pipe(map((data) => {
        return { rounds: data.rounds.map(round => {
          return {
            score: round.score,
            course: round.course,
            rating: round.rating,
            slope: round.slope,
            date: round.date,
            id: round._id
          };
        }), maxRounds: data.maxRounds};
      }))
      .subscribe((transformedRoundsData) => {
        this.rounds = transformedRoundsData.rounds;
        this.roundsUpdated.next({rounds: [...this.rounds], roundsCount: transformedRoundsData.maxRounds});
      });
  }

  getRound(id: string) {
    return this.http.get<{
      _id: string,
      score: number,
      course: string,
      slope: number,
      rating: number,
      date: string}>('http://localhost:3000/api/rounds/' + id);
  }

  /**
   * Add a round to the local api running on node
   */
  addRound(score: number, course: string, rating: number, slope: number, date: string) {
    // const roundData = new FormData();
    // roundData.append('score', score.toString());
    // roundData.append('course', course);
    // roundData.append('rating', rating.toString());
    // roundData.append('slope', slope.toString());
    // roundData.append('date', date);
    // roundData.append('courseLogo', courseLogo, course);
    // UNCOMMENT HERE AND REMOVE THE LINES ABOVE
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
        //DELETE LINE 82 WHEN YOU WANT TO REMOVE
        // const round: Round = {id: data.round.id, score: score, course: course, rating: rating, slope: slope, date: date};
        this.router.navigate(['/']);
      });
  }

  updateRound(id: string, score: number, course: string, rating: number, slope: number, date: string) {
    const round: Round = {
      id: id,
      score: score,
      course: course,
      rating: rating,
      slope: slope,
      date: date
    };
    this.http.put('http://localhost:3000/api/rounds/' + id, round)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteRound(roundId: string) {
    return this.http.delete('http://localhost:3000/api/rounds/' + roundId);
  }
}
