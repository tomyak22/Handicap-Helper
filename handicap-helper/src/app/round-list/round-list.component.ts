import { Component, OnInit, OnDestroy } from '@angular/core';
import { Round } from '../models/round.model';
import { Subscription } from 'rxjs';
import { RoundsService } from '../services/rounds.service';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  userId: string;

  constructor(
    public roundsService: RoundsService,
    private authService: AuthService,
    private alertMessage: MatSnackBar,
    private deleteDialog: MatDialog
  ) { }

  /**
   * Subscribe to RoundsService to load in the rounds that we have
   * in our database as well as the number of rounds we currently have
   * for our paginator.
   */
  ngOnInit(): void {
    this.isLoading = true;
    this.roundsService.getRounds(this.roundsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.roundsSub = this.roundsService.getRoundsUpdateListener()
      .subscribe((roundsData: {rounds: Round[], roundsCount: number}) => {
        this.isLoading = false;
        this.totalRounds = roundsData.roundsCount;
        this.rounds = roundsData.rounds;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  /**
   * Reloads in which rounds are to be displayed based on how many rounds we
   * want to display and which page we are on.
   * @param pageData to get the index of current page and the amount of
   * rounds we want to display per page
   */
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.roundsPerPage = pageData.pageSize;
    this.roundsService.getRounds(this.roundsPerPage, this.currentPage);
  }

  /**
   * Method that uses the DELETE method in Node to delete a round based on
   * the round id.
   * @param roundId id for the round we wish to delete
   */
  onDelete(roundId: string) {
    this.isLoading = true;
    this.roundsService.deleteRound(roundId).subscribe(() => {
      this.alertMessage.open('Round Deleted!', null, { duration: 2000 });
      this.roundsService.getRounds(this.roundsPerPage, this.currentPage);
    });
  }

  confirmDelete(roundId: string) {
    const dialogResponse = this.deleteDialog.open(DeleteDialogComponent);
    dialogResponse.afterClosed().subscribe(result => {
      if(result.deleteResponse) {
        this.onDelete(roundId);
      }
    });
  }

  ngOnDestroy(): void {
    this.roundsSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

}
