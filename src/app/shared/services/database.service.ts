import { inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getDatabase, ref, set, get, DataSnapshot } from '@firebase/database';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private firebaseApp = inject(FirebaseApp);
  private database = getDatabase(
    this.firebaseApp,
    environment.firebaseConfig.databaseURL
  );

  write<T>(path: string, data: T): void {
    set(ref(this.database, path), data);
  }

  read(path: string): Promise<DataSnapshot> {
    console.log('path', path)
    return get(ref(this.database, path));
  }
}
