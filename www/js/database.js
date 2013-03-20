// global variables
var db;

//this is called when an error happens in a transaction
function errorHandler(transaction, error) {
   alert('Error: ' + error.message + ' code: ' + error.code);
}
 
// this is called when a successful transaction happens
function successCallBack() {
   // not needed
}
 
function nullHandler(){};

$(document).ready(function(){
	/**
	 * The action listener for the button.
	 */
	$("#btnRecord").click(function(){
		if(!db){
			createDB();	
		}
		AddValueToDB();
		$(".textArea").val(" ");
  });
	
	/**
	 * The action listener for the delete button.
	 */
	$("#btnDelete").click(function(){
		deleteRecords();
  });
});

/**
 * Creates the database.
 */
function createDB(){
	// check to see if the device supports local databases. 
	if (!window.openDatabase) {
	   alert('Databases are not supported in this browser.');
	   return;
	 }
	 
	// go ahead and create the database.
	 var shortName = 'WebSqlDB';
	 var version = '1.0';
	 var displayName = 'WebSqlDB';
	 var maxSize = 65535;

	 // create or open the database base locally on the device and store the db object  
	 db = openDatabase(shortName, version, displayName,maxSize);
	// try to create the table User in the database just created/opened
	 db.transaction(function(tx){
	 
	  // create the table and its rows
	  tx.executeSql( 'CREATE TABLE IF NOT EXISTS User(UserId INTEGER NOT NULL PRIMARY KEY, FirstName TEXT NOT NULL, LastName TEXT NOT NULL)',
	[],nullHandler,errorHandler);
	 },errorHandler,successCallBack);
	 
	 // If the database has any information it should be displayed.
	 ListDBValues();
}

/** This is the function that puts values into the database 
 * using the values from the text boxes on the screen.
 * 
 */
function AddValueToDB() {
if (!window.openDatabase) {
alert('Databases are not supported in this browser.');
return;
}
// insert the values into the User table
db.transaction(function(transaction) {
transaction.executeSql('INSERT INTO User(FirstName, LastName) VALUES (?,?)',[$('#txFirstName').val(), $('#txLastName').val()], nullHandler,errorHandler);
});

//this calls the function that will show what is in the User table in the database
ListDBValues();
} 

/**
 * List the values in the database to the screen using jquery to update the #lbUsers element
 */
function ListDBValues() {
if (!window.openDatabase) {
alert('Databases are not supported in this browser.');
return;
}

/* Clear out any content in the #lbUsers element on the
* page so that the next few lines will show updated
* content and not just keep repeating lines. */
$('#lbUsers').html('');
	
if (db) {
	// select all the content and append the UserId, FirstName and LastName
	// to the #lbUsers element.
	db.transaction(function(transaction) {
		transaction.executeSql('SELECT * FROM User;', [], function(
				transaction, result) {
			if (result != null && result.rows != null) {
				for ( var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					$('#lbUsers').append('<br>' + row.UserId + '. ' + row.FirstName	+ ' ' + row.LastName);
				}
			}
		}, errorHandler);
	}, errorHandler, nullHandler);
}
return;
}

/**
 * Deletes all records from the table User.
 */
function deleteRecords(){
	 db.transaction(function(tx){
	  tx.executeSql( 'DELETE FROM User',nullHandler,nullHandler);
	  ListDBValues();
	 });
}