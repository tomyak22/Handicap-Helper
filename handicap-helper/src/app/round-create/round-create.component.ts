import { Component, OnInit } from '@angular/core';
import { RoundsService } from '../services/rounds.service';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Round } from '../models/round.model';
import { mimeType } from './mime-type.validator';

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
  form: FormGroup;
  private mode = 'create';
  private roundId: string;
  round: Round;
  isLoading = false;
  imagePreview;

  constructor(
    public roundsService: RoundsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'score': new FormControl(null, {validators: [Validators.required]}),
      'course': new FormControl(null, {validators: [Validators.required]}),
      'rating': new FormControl(null, {validators: [Validators.required]}),
      'slope': new FormControl(null, {validators: [Validators.required]}),
      'date': new FormControl(null, {validators: [Validators.required]}),
      // REMOVE IMAGES HERE LATER
      'courseLogo': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    });

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
          this.form.setValue({
            'score': this.round.score,
            'course': this.round.course,
            'rating': this.round.rating,
            'slope': this.round.slope,
            'date': this.round.date
          });
        });
      } else {
        this.mode = 'create';
        this.roundId = null;
      }
    });
  }

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

  // REMOVE LATER ON PLEASE
  onImagedPicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({courseLogo: file});
    this.form.get('courseLogo').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

}
