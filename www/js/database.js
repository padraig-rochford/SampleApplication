// global variables
var db;
var shortName = 'WebSqlDB';
var version = '1.0';
var displayName = 'WebSqlDB';
var maxSize = 65535;
 
// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
   alert('Error: ' + error.message + ' code: ' + error.code);
}

// this is called when a successful transaction happens
function successCallBack() {
	ListDBValues();
}
 
function nullHandler(){};
 
// called when the application loads
function onBodyLoad(){
 if (!window.openDatabase) {
   alert('Databases are not supported in this browser.');
   return;
 }
 
 db = openDatabase(shortName, version, displayName,maxSize);
 
 db.transaction(function(tx){
 
   tx.executeSql( 'CREATE TABLE IF NOT EXISTS User(UserId INTEGER NOT NULL PRIMARY KEY, FirstName TEXT NOT NULL, LastName TEXT NOT NULL)', [],nullHandler,errorHandler);
 },errorHandler,successCallBack);
}
 
// lists all the records in the data base
function ListDBValues() {
 if (!window.openDatabase) {
  alert('Databases are not supported in this browser.');
  return;
 }
 
 $('#lbUsers').html('');
 
 db.transaction(function(transaction) {
   transaction.executeSql('SELECT * FROM User;', [],
     function(transaction, result) {
      if (result != null && result.rows != null) {
        for (var i = 0; i < result.rows.length; i++) {
          var row = result.rows.item(i);
          $('#lbUsers').append('<br>' + row.UserId + '. ' +
row.FirstName+ ' ' + row.LastName);
        }
      }
     },errorHandler);
 },errorHandler,nullHandler);

 return;
}
 
// this will add a new record to the database
function AddValueToDB() {
 if (!window.openDatabase) {
   alert('Databases are not supported in this browser.');
   return;
 }
 
 if(!db){
	 // double check that the database was created.
	 db = openDatabase(shortName, version, displayName,maxSize);
 }
 
 db.transaction(function(transaction) {
   transaction.executeSql('INSERT INTO User(FirstName, LastName) VALUES (?,?)',[$('#txFirstName').val(), $('#txLastName').val()],
     nullHandler,errorHandler);
   });
 
 // diplay the new records.
 ListDBValues();
 return false;
}

/**
 * Deletes all records from the table User.
 */
function deleteRecords(){
	ListDBValues();
	if(db){
	 db.transaction(function(tx){
		 db.transaction(function(tx){
			   //tx.executeSql( 'DROP TABLE User',nullHandler,nullHandler);
			   tx.executeSql( 'DELETE FROM User',nullHandler,nullHandler);
			 },errorHandler,successCallBack);
	 });
	}
}