import { Component, OnInit } from '@angular/core';
import { RoundsService } from '../services/rounds.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Round } from '../models/round.model';
import { mimeType } from './mime-type.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-round-create',
  templateUrl: './round-create.component.html',
  styleUrls: ['./round-create.component.css']
})
export class RoundCreateComponent implements OnInit {
  // Variables to be used
  enteredScore = null;
  enteredCourse = '';
  enteredRating = null;
  enteredSlope = null;
  enteredDate = '';
  form: FormGroup;
  private mode = 'create';
  private roundId: string;
  round: Round;
  isLoading = false;
  imagePreview;

  constructor(
    public roundsService: RoundsService,
    public route: ActivatedRoute,
    private alertMessage: MatSnackBar
  ) { }

  ngOnInit(): void {
    /**
     * Set the form to null if there is no id in the params of the url.
     */
    this.form = new FormGroup({
      'score': new FormControl(null, {validators: [Validators.required]}),
      'course': new FormControl(null, {validators: [Validators.required]}),
      'rating': new FormControl(null, {validators: [Validators.required]}),
      'slope': new FormControl(null, {validators: [Validators.required]}),
      'date': new FormControl(null, {validators: [Validators.required]}),
      // REMOVE IMAGES HERE LATER
      // 'courseLogo': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

    /**
     * If there is an id for the round in the url, subscribe and set the form
     * to use the data from that specific round. This will set the mode to be edit
     * to let us know that we are editing an existing round.
     */
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
            date: data.date,
            creator: data.creator
          };
          this.form.setValue({
            'score': this.round.score,
            'course': this.round.course,
            'rating': this.round.rating,
            'slope': this.round.slope,
            'date': this.round.date
          });
        },
        err => {
          console.log(err);
        });
      } else {
        this.mode = 'create';
        this.roundId = null;
      }
    });
  }

  /**
   * Adds a round to the database. If we are in create mode (no id in the url),
   * we will be using the POST method from Node. If we are updating an existing
   * round (id in the url), we will use the PUT method from Node to update the
   * round.
   */
  onAddRound() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.roundsService.addRound(
        this.form.value.score,
        this.form.value.course,
        this.form.value.rating,
        this.form.value.slope,
        this.form.value.date
      );
    } else {
      this.roundsService.updateRound(
        this.roundId,
        this.form.value.score,
        this.form.value.course,
        this.form.value.rating,
        this.form.value.slope,
        this.form.value.date);
    }
    this.form.reset();
  }

  /**
   * Alert Message for user when they save a round
   */
  roundSavedMessage() {
    this.alertMessage.open('Round Saved!', null, { duration: 2000 });
  }

}
