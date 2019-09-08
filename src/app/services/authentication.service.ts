import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private firestore: AngularFirestore) {}

  getMembers(member: string): Observable<unknown[]> {
    return this.firestore.collection('members', ref => ref.where('name', '==', member))
    .valueChanges();
  }

}
