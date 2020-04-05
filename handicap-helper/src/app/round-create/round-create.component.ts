import { Component, OnInit } from '@angular/core';
import { RoundsService } from '../services/rounds.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Round } from '../models/round.model';

@Component({
  selector: 'app-round-create',
  templateUrl: './round-create.component.html',
  styleUrls: ['./round-create.component.css']
})
export class RoundCreateComponent implements OnInit {
  enteredScore = null;
  enteredCourse = '';
  enteredRating = null;
  enteredSlope = null;
  enteredDate = '';
  private mode = 'create';
  private roundId: string;
  round: Round;
  isLoading = false;

  constructor(
    public roundsService: RoundsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('roundId')) {
        this.mode = 'edit';
        this.roundId = paramMap.get('roundId');
        this.isLoading = true;
        this.roundsService.getRound(this.roundId).subscribe(data => {
          this.isLoading = false;
          this.round = {
            id: data._id,
            score: data.score,
            course: data.course,
            rating: data.rating,
            slope: data.slope,
            date: data.date
          };
        });
      } else {
        this.mode = 'create';
        this.roundId = null;
      }
    });
  }

  onAddRound(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.roundsService.addRound(
        form.value.score,
        form.value.course,
        form.value.rating,
        form.value.slope,
        form.value.date
      );
    } else {
      this.roundsService.updateRound(
        this.roundId,
        form.value.score,
        form.value.course,
        form.value.rating,
        form.value.slope,
        form.value.date);
    }
    form.resetForm();
  }

}
