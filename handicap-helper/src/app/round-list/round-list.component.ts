import { Component, OnInit, OnDestroy } from '@angular/core';
import { Round } from '../models/round.model';
import { Subscription } from 'rxjs';
import { RoundsService } from '../services/rounds.service';

@Component({
  selector: 'app-round-list',
  templateUrl: './round-list.component.html',
  styleUrls: ['./round-list.component.css']
})
export class RoundListComponent implements OnInit, OnDestroy {
  rounds: Round[] = [];
  private roundsSub: Subscription;

  constructor(
    public roundsService: RoundsService
  ) { }

  ngOnInit(): void {
    this.roundsService.getRounds();
    this.roundsSub = this.roundsService.getRoundsUpdateListener()
      .subscribe((rounds: Round[]) => {
        this.rounds = rounds;
      });
  }

  onDelete(roundId: string) {
    this.roundsService.deletePost(roundId);
  }

  ngOnDestroy(): void {
    this.roundsSub.unsubscribe();
  }

}
