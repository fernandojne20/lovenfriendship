import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, DocumentChangeAction } from '@angular/fire/firestore';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaperService {

  constructor(private firestore: AngularFirestore) { }

  getMemberPaper(member: string): Observable<unknown[]> {
    return this.firestore.collection('papersSorted', ref => ref.where('member', '==', member))
    .valueChanges();
  }

  getAvailablePapers(member: string): Observable<DocumentChangeAction<unknown>[]> {
    return this.firestore.collection('papersSorted', ref => ref.where('choosen', '==', false))
    .snapshotChanges()
    .pipe(
      map((papers: DocumentChangeAction<any>[]): DocumentChangeAction<unknown>[] => {
        return papers.map((paper: DocumentChangeAction<any>) => {
          if (paper.payload.doc.data().member !== member) {
            return paper;
          }
        });
      })
    );
  }

  updatePaper(member: string, paper: DocumentChangeAction<unknown>): Promise<any> {
    return this.firestore.collection('papersSorted')
    .doc(paper.payload.doc.id)
    .set({member, choosen: true}, {merge: true});
  }
}
