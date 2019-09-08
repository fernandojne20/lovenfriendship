import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  authForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router
    ) { }

  ngOnInit() {
    this.registerForm();
  }

  registerForm() {
    this.authForm = this.formBuilder.group({
      member: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {

    if (this.authForm.valid) {
      this.authForm.disable();
      this.validateMember(this.authForm.value.member);
    } else {
      console.log('Emburrao');
    }
  }
  validateMember(member: string): void {
    this.authService.getMembers(member).subscribe((members: unknown[]) => {
      console.log('members', members);
      if (members.length > 0) {
        this.router.navigate(['lovenfriendship', member]);
      } else {
        this.displaySnackbar('El usuario no es válido', 5000);
        this.authForm.enable();
      }
    }, error => this.displaySnackbar(error, 5000)
    );
  }

  displaySnackbar(message: string, duration: number): void {
    this.snackbar.open(message, '', {
      duration
    });
  }
}
