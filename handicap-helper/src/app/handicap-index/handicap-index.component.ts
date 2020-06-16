import { Component, OnInit } from '@angular/core';
import { RoundsService } from '../services/rounds.service';
import { AuthService } from '../services/auth.service';
import { Round } from '../models/round.model';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-handicap-index',
  templateUrl: './handicap-index.component.html',
  styleUrls: ['./handicap-index.component.css']
})
export class HandicapIndexComponent implements OnInit {
  rounds: Round[] = [];
  round: Round;
  handicap;
  private roundsSub: Subscription;
  totalRounds = 0;
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;

  constructor(
    public roundsService: RoundsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.roundsService.getRounds(null, null);
    this.roundsSub = this.roundsService.getRoundsUpdateListener()
      .subscribe((roundsData: { rounds: Round[], roundsCount: number }) => {
        this.totalRounds = roundsData.roundsCount;
        this.handicap = this.getHandicap();
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  /**
   * Calculates Handicap of the user based on the previous 20 rounds OR if the user has less
   * it will be based on the number of rounds played
   * @param rounds the user has played from the service
   */
  getHandicap(): Observable<number> {
    let handicap = 0;
    return this.roundsService.getLatestTwentyRounds().pipe(map(rounds => {
      const differentials = this.getDifferentials(rounds);
      const averageDifferential = this.getAverageOfNDifferentials(differentials);
      handicap = this.roundValue((averageDifferential * 0.96), 1);
      return handicap;
    }));
  }

  /**
   * Returns all of the differentials for rounds played for a user
   * @param rounds played by the logged in user
   */
  getDifferentials(rounds): number[] {
    const differentials = [];
    for (const round of rounds) {
      const differential = (round.score - round.rating) * 113 / round.slope;
      differentials.push(differential);
    }
    differentials.sort();
    return differentials;
  }

  /**
   * Calculates the Average of differentials based on the number of rounds played by
   * the user
   * @param differentials from the user's last N rounds
   */
  getAverageOfNDifferentials(differentials): number {
    let lowestDifferentials = 0;
    if (this.totalRounds <= 5) {
      lowestDifferentials = 1;
    }
    else if (this.totalRounds <= 8) {
      lowestDifferentials = 2;
    }
    else if (this.totalRounds <= 11) {
      lowestDifferentials = 3;
    }
    else if (this.totalRounds <= 14) {
      lowestDifferentials = 4;
    }
    else if (this.totalRounds <= 16) {
      lowestDifferentials = 5;
    }
    else if (this.totalRounds <= 18) {
      lowestDifferentials = 6;
    }
    else if (this.totalRounds === 19) {
      lowestDifferentials = 7;
    }
    else if (this.totalRounds >= 20) {
      lowestDifferentials = 8;
    }

    let differentialsSum = 0;
    for (let i = 0; i < lowestDifferentials; i ++) {
      differentialsSum += differentials[i];
    }
    const averageDifferential = differentialsSum / lowestDifferentials;
    return averageDifferential;
  }

  /**
   * Rounds the variable to a specific decimal place
   * @param value to be rounded
   * @param decimals amount of places to be rounded to
   */
  roundValue(value, decimals) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }
}
