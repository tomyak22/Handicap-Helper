import { Injectable } from '@angular/core';
import { Round } from '../models/round.model';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoundsService {
  private rounds: Round[] = [];
  private roundsUpdated = new Subject<{rounds: Round[], roundsCount: number}>();
  public updateHandicap = new Subject<void>();

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
   * Uses GET method from round.js to get the rounds from the api
   * @param roundsPerPage number of rounds we wish to display per page
   * @param currentPage the index of our current page
   */
  getRounds(roundsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${roundsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, rounds: any, nRounds: number }>('http://localhost:3000/api/rounds' + queryParams)
      .pipe(map((data) => {
        return { rounds: data.rounds.map(round => {
          return {
            score: round.score,
            course: round.course,
            rating: round.rating,
            slope: round.slope,
            date: round.date,
            id: round._id,
            creator: round.creator
          };
        }), nRounds: data.nRounds};
      }))
      .subscribe((transformedRoundsData) => {
        this.rounds = transformedRoundsData.rounds;
        this.roundsUpdated.next({rounds: [...this.rounds], roundsCount: transformedRoundsData.nRounds});
      });
  }

  /**
   * Gets the last 20 rounds played from a user
   */
  getLatestTwentyRounds(): Observable<Round[]>  {
    return this.http.get< { message: string, rounds: any }>('http://localhost:3000/api/rounds/lastTwentyRounds')
      .pipe(map((data) => {
        return data.rounds.map(round => {
          return {
            score: round.score,
            course: round.course,
            rating: round.rating,
            slope: round.slope,
            date: round.date,
            id: round._id,
            creator: round.creator
          };
        });
      }));
  }

  // TODO: See if we can replace with the Object Round
  /**
   * Uses GET method from round.js in order to fetch one individual round from backend
   * @param id id of the round we wish to retrieve
   */
  getRound(id: string) {
    return this.http.get<{
      _id: string,
      score: number,
      course: string,
      slope: number,
      rating: number,
      date: string,
      creator: string}>('http://localhost:3000/api/rounds/' + id);
  }

  /**
   * Adds a round using the POST method to create a new round using the api from
   * node on the mid-tier.
   * @param score the user's score for that round
   * @param course course played for that round
   * @param rating course rating used for handicap calc
   * @param slope course slope used for the handicap calc
   * @param date date the round was played
   */
  addRound(score: number, course: string, rating: number, slope: number, date: string) {
    const round: Round = {
      id: null,
      score: score,
      course: course,
      rating: rating,
      slope: slope,
      date: date,
      creator: null
    };
    this.http.post<{ message: string, roundId: string }>('http://localhost:3000/api/rounds', round)
      .subscribe(data => {
        this.router.navigate(['/']);
      });
  }

  /**
   * Uses PUT method from round.js in order to update a current round based on the id we use
   * from the backend.
   * @param score the user's score for that round
   * @param course course played for that round
   * @param rating course rating used for handicap calc
   * @param slope course slope used for the handicap calc
   * @param date date the round was played
   */
  updateRound(id: string, score: number, course: string, rating: number, slope: number, date: string) {
    const round: Round = {
      id: id,
      score: score,
      course: course,
      rating: rating,
      slope: slope,
      date: date,
      creator: null
    };
    this.http.put('http://localhost:3000/api/rounds/' + id, round)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  /**
   * Uses DELETE method from node to remove an existing round from the database
   * @param roundId id of the round we wish to delete
   */
  deleteRound(roundId: string) {
    return this.http.delete('http://localhost:3000/api/rounds/' + roundId);
  }
}
