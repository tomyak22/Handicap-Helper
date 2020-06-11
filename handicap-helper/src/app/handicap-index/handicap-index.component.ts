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
      .subscribe((roundsData: {rounds: Round[], roundsCount: number}) => {
        this.totalRounds = roundsData.roundsCount;
        this.handicap = this.getHandicap(roundsData.rounds);
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  getHandicap(rounds): number {
    let handicap = 0;
    let totalHandicap = 0;
    let differential = 0;
    // if there are less than 10 rounds played we will take the best score
    // and calculate the handicap with that score only
    // TODO put in logic to make a copy of the scores into a new array
    // and sort them from low to high
    if (this.totalRounds < 10) {
      for (const round of rounds) {
        totalHandicap += (round.score - round.rating) * 113 / round.slope;
      }
      differential = totalHandicap / this.totalRounds;
    }
    // if there are less than 10 rounds but more than 10 rounds played
    // we will calculate the handicap based on number of rounds played
    else if (this.totalRounds < 20 && this.totalRounds >= 10) {
      for (const round of rounds) {
        totalHandicap += (round.score - round.rating) * 113 / round.slope;
      }
      differential = totalHandicap / this.totalRounds;
    }
    // If there are more than 20 rounds played we will take the best 10 scores
    // and calculate the handicap with that.
    else {
      for (const round of rounds) {
        totalHandicap += (round.score - round.rating) * 113 / round.slope;
      }
      differential = totalHandicap / this.totalRounds;
    }

    return differential * 0.96;
  }

}
