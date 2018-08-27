import { db } from './OfflineDatabase';

// Create a new user object and display the id
let id = db.ref('users').push({ name: ​"Alice"​, email: "alice@email.com" });
console.log(id);

// Create a new user object and display the id
id = db.ref('users').push({ name: ​"Bob"​, address: { city:​ "New York"​, country: ​"US"​ }});
console.log(id);

// Retrieve the data from the currently set path 
db.ref('users/ID2/address/city').once(console.log);
db.ref(​"users/ID1"​).once(console.log);

// Remove the data under the currently set path.
db.ref('users/ID2/address').remove();
db.ref(​"users"​).remove();