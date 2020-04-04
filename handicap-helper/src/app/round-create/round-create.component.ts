import { Component, OnInit } from '@angular/core';
import { RoundsService } from '../services/rounds.service';
import { NgForm } from '@angular/forms';

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

  constructor(
    public roundsService: RoundsService
  ) { }

  ngOnInit(): void {
  }

  onAddRound(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.roundsService.addRound(
      form.value.score,
      form.value.course,
      form.value.rating,
      form.value.slope,
      form.value.date
    );
    form.resetForm();
  }

}
