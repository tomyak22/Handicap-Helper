import { Component, OnInit, OnDestroy } from '@angular/core';
import { Round } from '../models/round.model';
import { Subscription } from 'rxjs';
import { RoundsService } from '../services/rounds.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-round-list',
  templateUrl: './round-list.component.html',
  styleUrls: ['./round-list.component.css']
})
export class RoundListComponent implements OnInit, OnDestroy {
  rounds: Round[] = [];
  private roundsSub: Subscription;
  isLoading = false;
  totalRounds = 0;
  roundsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [3, 5, 8, 15, 20];

  constructor(
    public roundsService: RoundsService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.roundsService.getRounds(this.roundsPerPage, this.currentPage);
    this.roundsSub = this.roundsService.getRoundsUpdateListener()
      .subscribe((roundsData: {rounds: Round[], roundsCount: number}) => {
        this.isLoading = false;
        this.totalRounds = roundsData.roundsCount;
        this.rounds = roundsData.rounds;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.roundsPerPage = pageData.pageSize;
    this.roundsService.getRounds(this.roundsPerPage, this.currentPage);
  }

  onDelete(roundId: string) {
    this.isLoading = true;
    this.roundsService.deleteRound(roundId).subscribe(() => {
      this.roundsService.getRounds(this.roundsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.roundsSub.unsubscribe();
  }

}
