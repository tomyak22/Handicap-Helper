import { Component, OnInit } from '@angular/core';
import { RoundsService } from '../services/rounds.service';
import { AuthService } from '../services/auth.service';
import { Round } from '../models/round.model';
import { Subscription } from 'rxjs';

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
        this.handicap = this.getHandicap(roundsData.rounds);
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  /**
   * 
   * @param rounds 
   */
  getHandicap(rounds): number {
    let handicap = 0;
    const previousTwentyRounds = this.getLastNRounds(rounds, 20);
    const differentials = this.getDifferentials(rounds);
    const averageDifferential = this.getAverageOfNDifferentials(differentials);
    handicap = this.roundValue((averageDifferential * 0.96), 1);
    return handicap;
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
   * 
   * @param differentials 
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
   * 
   * @param rounds 
   * @param nRounds 
   */
  getLastNRounds(rounds: Round[], nRounds): Round[] {
    let latestRounds: Round[];
    rounds.sort((round1, round2) => {
      if (new Date(round1.date) < new Date(round2.date)) {
        return 1;
      }
      if (new Date(round1.date) > new Date(round2.date)) {
        return -1;
      }
      return 0;
    });
    latestRounds = rounds.slice(0, nRounds);
    return latestRounds;
  }

  roundValue(value, decimals) {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
  }
}
