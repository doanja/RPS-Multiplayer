let database;

const getSchedule = db => {
  db.ref().on(
    'value',
    snapshot => {
      console.log('snapshot.val() :', snapshot.val());
    },
    err => {
      console.log('Error reading from database: ', err.code);
    }
  );
};

/**
 * function to initialize the firebase
 * @param {string} key the api key used to access the database
 */
const initializeFirebase = (key = FIREBASE_API_KEY) => {
  var firebaseConfig = {
    apiKey: key,
    authDomain: 'rps-multiplayer-f29dd.firebaseapp.com',
    databaseURL: 'https://rps-multiplayer-f29dd.firebaseio.com',
    storageBucket: ''
  };

  firebase.initializeApp(firebaseConfig);
  return firebase.database();
};

window.onload = () => {
  // set the database
  database = initializeFirebase();

  // --------------------------------------------------------------
  // Link to Firebase Database for viewer tracking
  let connectionsRef = database.ref('/connections');
  let connectedRef = database.ref('.info/connected');

  // Add ourselves to presence list when online.
  connectedRef.on('value', function(snap) {
    if (snap.val()) {
      let con = connectionsRef.push(true);
      con.onDisconnect().remove();
    }
  });

  // Number of online users is the number of objects in the presence list.
  connectionsRef.on('value', snapshot => {
    $('#connected-viewers').text(snapshot.numChildren());
  });

  getSchedule(database);
  //   $()
};
