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
  averageScore;
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
        this.rounds = roundsData.rounds;
        this.averageScore = this.getAverageTest(this.rounds);
        this.totalRounds = roundsData.roundsCount;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  getAverageTest(rounds): number {
    let totalScore = 0;
    let averageScore = 0;
    for (const round of rounds) {
      totalScore += round.score;
    };
    averageScore = totalScore / this.totalRounds;
    return averageScore;
  }

}
