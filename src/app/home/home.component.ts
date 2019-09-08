import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperService } from '../services/paper.service';
import { DocumentSnapshot, DocumentChangeAction } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { templateJitUrl } from '@angular/compiler';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public member: string;
  public alreadyGenerated: boolean;
  public generatedPaper: boolean;
  public paperName: string;
  // public takenPaper: DocumentChangeAction<unknown>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private paper: PaperService,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.alreadyGenerated = false;
    this.generatedPaper = false;
   }

  ngOnInit() {
    this.member = this.activatedRoute.snapshot.params.member;
    this.validateMember(this.member);
  }

  validateMember(member: string) {
    this.auth.getMembers(member)
    .pipe(take(1))
    .subscribe(members => {
      if (members.length  === 0) {
        this.router.navigate(['auth']);
      } else {
        this.getMembers(this.member);
      }
    });
  }

  getMembers(member: string) {
    this.paper.getMemberPaper(member)
    .pipe(take(1))
    .subscribe((members: DocumentChangeAction<unknown>[]) => {
      if (members.length > 0) {
        this.alreadyGenerated = true;
      } else {
        this.alreadyGenerated = false;
      }
      return members;
    });
  }

  updatePaper() {
    this.validateMember(this.member);
    setTimeout(() => {
      if (!this.alreadyGenerated) {
        this.paper.getAvailablePapers(this.member)
        .pipe(take(1))
        .subscribe((papers: DocumentChangeAction<unknown>[]) => {
          console.log('generatedPaper', this.generatedPaper);
          if (!this.generatedPaper) {
            this.takePaper(papers);
            this.generatedPaper = true;
          }
          });
      }
    }, 1000);
  }

  takePaper(papers: DocumentChangeAction<unknown>[]) {
    const randomValue = Math.floor((Math.random() * papers.length) + 1);
    const takenPaper: DocumentChangeAction<any> = papers[randomValue - 1];
    console.log(takenPaper);

    this.paper.updatePaper(this.member, takenPaper)
      .then(
        success => {
          this.paperName = takenPaper.payload.doc.data().paper;
          this.generatedPaper = true;
          console.log('generatedPaperfwef', this.generatedPaper);
        },
        error => {
          console.log('error', error);
          this.generatedPaper = false;

        }
      );
  }

}
