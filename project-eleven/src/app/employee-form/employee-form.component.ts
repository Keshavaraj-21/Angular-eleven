import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControlOptions,
} from '@angular/forms';
import { rangeValidator, emailMatchValidator } from './validator';
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css'],
})
export class EmployeeFormComponent implements OnInit {
  employeeFormGroup: FormGroup;
  // empRecord: any = {
  //   firstName: 'Keshav',
  //   lastName: 'Raj',
  //   email: 'keshavaraj9600@gmail.com',
  //   mobile: '9600814311'
  // }
  // formOptions: AbstractControlOptions = { validators: emailMatchValidator };
  // constructor(private fb: FormBuilder) {
  //   this.employeeFormGroup = this.fb.group({
  //     firstName: [this.empRecord.firstName, [Validators.required, Validators.minLength(3)]],
  //     lastName: [this.empRecord.lastName],
  //     emailGroup: this.fb.group({
  //       email: [this.empRecord.email, [Validators.required, Validators.email]],
  //       confirmEmail: ['', [Validators.required, Validators.email]],
  //     }, { validators: emailMatchValidator }),
  //     mobile: [this.empRecord.mobile],
  //     sendNotification: ['email'],
  //     range: ['', [rangeValidator(10, 20)]]

  //   })
  // }
  constructor(private fb: FormBuilder) {
    this.employeeFormGroup = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: [''],
      emailGroup: this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', [Validators.required, Validators.email]],
        },
        { validators: emailMatchValidator }
      ),
      mobile: [''],
      sendNotification: ['email'],
      range: ['', [rangeValidator(10, 20)]],
    });
  }

  ngOnInit(): void {}
  /*
   * ! is non-null assertion oopeartor(post-fix expression)
   * - it just saying to type checker that youre sure that a is not nul or undefined .
   * the opeartion a! produces a value of the type of a with
   * null and undefined excluded
   * if a is of type string then a! ensure that it will return
   * a string value , and not NULL or  UNDEFINED.
   */
  get firstName() {
    return this.employeeFormGroup.get('firstName')!;
  }
  get email() {
    return this.employeeFormGroup.get('email')!;
  }
  get range() {
    return this.employeeFormGroup.get('range')!;
  }
  get emailGroup() {
    return this.employeeFormGroup.get('emailGroup')!;
  }
  get mobile() {
    return this.employeeFormGroup.get('mobile')!;
  }
  loadEmployee() {
    let data = {
      firstName: 'Keshavaraj',
      lastName: 'Manoharan',
    };
    this.employeeFormGroup.patchValue(data);
  }
  doNotification(msgtype: any) {
    if (msgtype == 'sms') {
      let mobileControl = this.employeeFormGroup.get('mobile');
      mobileControl?.setValidators([
        Validators.required,
        rangeValidator(6000000000, 9999999999),
      ]);
      mobileControl?.updateValueAndValidity();
    }
  }
}
