import * as fs from 'fs';
import * as _ from 'lodash';

export interface Database { 
  // Sets the reference to the new given path.
  // @param path - The path.
  // @return - The current database instance.
  ref(path: string): Database,

  // Saves the object in the database under the currently set path,
  // assigning it a new unique id i.e. it is saved under "path/new_id/". // If the path does not exist, it creates it.
  // @param object - The data to be saved.
  // @return - The new unique id.
  push(obj: ​Object​): string,
  
  // Removes the data under the currently set path.
  remove(): void,
  
  // Retrieves the data from the currently set path and calls the
  // continuation function with the data as a parameter
  // @param continuation - Callback to be called with the data.
  once(continuation: (obj: any) => any): void
}

export class OfflineDatabase implements Database {
  db: Object = {};
  refPath: string;
  filePath: string = './offline-db.json';
  
  private save(): void {
    /* Write the db to a file then batch upload the file when 
       there's an active internet connection
    */
    fs.writeFileSync(this.filePath, JSON.stringify(this.db, null, 2));
  }
  
  ref(path: string): Database {
    // Set the reference to the new given path
    this.refPath = path.split('/').join('.');

    // Return current database instance
    return this;
  }
  
  push(obj: ​Object​): string {
    // Retrieve data from the db using the given path
    const data: Object = this.db[`${this.refPath}`];
    const size: number = _.size(data); // Get the size of the object
    const newId: string = `ID${size + 1}`; // Generate new unique ID

    /* Save the object in the db under the current given path,
       assigning it a new unique id. If the path doesn't exist, 
       it's created.
    */
    _.set(this.db, `${this.refPath}.${newId}`, obj);
    this.save();
    
    // Return the new unique id
    return newId;
  }
  
  remove(): void {
    // Removes the data under the current given path.
    _.unset(this.db, this.refPath);
    this.save();
  }
  
  once(continuation: (obj: any) => any): void {
    // Retrieve data from the db using the given path 
    const data: Object = _.get(this.db, this.refPath);

    // Call the callback function with data as a parameter 
    continuation(data);
  }
}

// Initialise the database singleton obbject
export const​ db: Database = new OfflineDatabase();
