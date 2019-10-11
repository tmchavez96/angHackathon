import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators, EmailValidator  } from '@angular/forms';
import { ApplicationService } from '../shared/application.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  private angForm: FormGroup;
  private mailingAddressText: string;
  private showMailingAddress: boolean;
  private employmentStatusValue: string;
  private isCitizen: string;
  private isCitizen2: string;
  private isResident: string;
  private hasSecondCountry: boolean;
  private hasSecondCountryButton: boolean;
  private phonePattern;
  private ssnPattern;

  private submitted: boolean;
  private autoApproved: boolean;
  private appId: string;
  private SSNExists: boolean;
  private waiting: boolean;

  constructor(private fb: FormBuilder, private service: ApplicationService) {}

  ngOnInit() {
    this.createForm();
    this.mailingAddressText = 'Add mailing address (if different from residential address)';
    this.showMailingAddress = false;
    this.employmentStatusValue = '';
    this.hasSecondCountry = false;
    this.hasSecondCountryButton = false;
    this.phonePattern = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
    this.ssnPattern = /^(\d{3}-\d{2}-\d{4})|(\d{3}\d{2}\d{4})$/;

    this.submitted = false;
    this.autoApproved = false;
    this.appId = '';
    this.SSNExists = false;
    this.waiting = false;

  }

  createForm() {
    this.angForm = this.fb.group({
      firstname: ['', Validators.required ],
      middleinitial: ['', Validators.maxLength(1)],
      address: ['', Validators.required ],
      mailingAddress: [''],
      lastname: ['', Validators.required],
      citizen: ['', Validators.required],
      citizen_2: [''],
      resident: [''],
      country: [''],
      country_2: [''],
      socialsecurity: ['', [Validators.required, Validators.pattern(this.ssnPattern)]],
      dob: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      bank: ['', Validators.required],
      employment: ['', Validators.required],
      occupation: [''],
      annualIncome: ['', Validators.required],
      monthlyRent: ['', Validators.required]
      // you will need to add more controls
    });
  }

  get phone() {
    return this.angForm.get('phone');
  }

  get ssn(){
    return this.angForm.get('socialsecurity');
  }

  submit() {
    const val = this.angForm.value;
    const dbEntry = {
      firstName: val.firstname,
      lastName: val.lastname,
      middleInitial: val.middleinitial,
      SSN: val.socialsecurity,
      citizen: val.citizen == 'yes' ? "United States" : val.country,
      resident: val.resident,
      otherCitizen: val.country_2,
      residentialAddress: val.address,
      mailingAddress: val.mailingAddress,
      email: val.email,
      phone: val.phone,
      bank: val.bank,
      employment: val.employment,
      occupation: val.occupation,
      annualIncome: val.annualIncome,
      monthlyRent: val.monthlyRent
    };
    this.waiting = true;
    this.service.submitApplication(dbEntry).subscribe((result) => {
      this.autoApproved = result['autoApproved'];
      this.appId = result['id'];
    },
    (err) => {
      const code = err['status'];
      switch (code) {
        case 487:
          this.SSNExists = true;
          break;
        case 500:

          break;
      }
      this.waiting = false;
    },
    () => {
      this.angForm.reset();
      this.submitted = true;
      this.waiting = false;
    });
  }

  toggleMailingAddress() {
    this.showMailingAddress = !this.showMailingAddress;
    this.mailingAddressText = this.showMailingAddress ? 'My mailing address is the same as my residential address' : 'Add mailing address (if different from residential address)';
    this.angForm.get('mailingAddress').reset();
  }

  employmentStatus(event: any) {
    this.employmentStatusValue = event.target.value;
    //console.log(this.angForm.get('empstatus').value);
    if (!(this.employmentStatusValue == 'Employed' || this.employmentStatusValue == 'Self-Employed' || this.employmentStatusValue == 'Other')) {
      this.angForm.get('occupation').reset();
    }
  }

  citizenOfUS() {
    this.isCitizen = this.angForm.get('citizen').value;
    if(this.isCitizen == "yes" || this.isCitizen == "no"){
      this.isResident = '';
      this.angForm.get('resident').reset();
      this.hasSecondCountry = false;
      this.isCitizen2 = '';
      this.angForm.get('citizen_2').reset();

      this.angForm.get('country').reset();
      this.angForm.get('country_2').reset();
    }
    console.log(this.angForm.get('citizen').value);
  }

  residentOfUS(){
    this.isResident = this.angForm.get('resident').value;
    console.log(this.angForm.get('resident').value);
  }

  addSecondCountry(){
    this.hasSecondCountryButton = true;
    this.addSecondCountry_2();
  }

  addSecondCountry_2(){
    this.isCitizen2 = this.angForm.get('citizen_2').value;
    if(this.isCitizen == "yes" && this.isCitizen2 == "yes"){
      this.hasSecondCountry = true;
    }else if (this.isCitizen == "yes" && this.isCitizen2 == "no"){
      this.hasSecondCountry = false;
      this.angForm.get('country_2').reset();
    }else if(this.isCitizen == "no" && this.hasSecondCountryButton == true){
      this.hasSecondCountry = true;
    }else if(this.isCitizen == "no" && this.hasSecondCountryButton == false){
      this.hasSecondCountry = false;
      this.angForm.get('country_2').reset();
    }
  }

  removeSecondCountry(){
    this.hasSecondCountryButton = false;
    //this.angForm.get('country_2').reset();
    this.addSecondCountry_2();
  }

}
