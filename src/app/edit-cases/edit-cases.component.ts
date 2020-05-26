import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-edit-cases',
  templateUrl: './edit-cases.component.html',
  styleUrls: ['./edit-cases.component.scss']
})
export class EditCasesComponent implements OnInit {

  casesForm: FormGroup;
  _id = '';
  Nombre = '';
  Genero = '';
  Edad: number = null;
  Direccion = '';
  Ciudad = '';
  Estado = '';
  Status = '';
  statusList = ['Positivo', 'Finado', 'Recuperado'];
  genderList = ['Hombre', 'Mujer'];
  isLoadingResults = false;
  matcher = new MyErrorStateMatcher();

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getCasesById(this.route.snapshot.params.id);
    this.casesForm = this.formBuilder.group({
      Nombre : [null, Validators.required],
      Genero : [null, Validators.required],
      Edad: [null, Validators.required],
      Direccion : [null, Validators.required],
      Ciudad: [null, Validators.required],
      Estado : [null, Validators.required],
      Status : [null, Validators.required]
    });
  }

  getCasesById(id: any) {
    this.api.getCasesById(id).subscribe((data: any) => {
      this._id = data._id;
      this.casesForm.setValue({
        Nombre: data.Nombre,
        Genero: data.Genero,
        Edad: data.Edad,
        Direccion: data.Direccion,
        Ciudad: data.Ciudad,
        Estado: data.Estado,
        Status: data.Status
      });
    });
  }
  onFormSubmit() {
    this.isLoadingResults = true;
    this.api.updateCases(this._id, this.casesForm.value)
      .subscribe((res: any) => {
          const id = res._id;
          this.isLoadingResults = false;
          this.router.navigate(['/cases-details', id]);
        }, (err: any) => {
          console.log(err);
          this.isLoadingResults = false;
        }
      );
  }
  casesDetails() {
    this.router.navigate(['/cases-details', this._id]);
  }

}
