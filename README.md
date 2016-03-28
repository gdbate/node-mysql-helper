# node-mysql-helper

A lightweight Promise-based wrapper and helper for felixge's node-Mysql.

##Features:

* Very slim library, only 2 dependancies ([Q](https://github.com/kriskowal/q) and [felixge's node-mysql](https://github.com/felixge/node-mysql)).
* Convenience functions for record selecting, inserting, updating and insert (on duplicate) updating.
* Connection pooling.
* Everything based on Promises.

##Initialize

Format you connection options based on [felixge's options](https://github.com/felixge/node-mysql#connection-options).

```javascript

var Mysql = require('node-mysql-helper');

var mysqlOptions = {
	host: 'localhost',
	user: 'myuser',
	password: 'chicken',
	database: 'mydb',
	socketPath: false,
	connectionLimit: 5
};

//For 5 pooled connections
Mysql.connect(mysqlOptions);

```
## Selecting a record

```javascript

//find user id 35
Mysql.record('user', 35)
	.then(function(record){
		console.log(record);
	})
	.catch(function(err){
		console.log('Error fetching record, mysql error:', err.message);
	});

//or select with an object
Mysql.record('user', {id: 35})
	.then(function(record){
		console.log(record);
	})
	.catch(function(err){
		console.log('Error fetching record, mysql error:', err.message);
	});

```

## Inserting a record

```javascript

var insert = {
	email: 'gdbate@gmail.com',
	firstName: 'Greg',
	lastName: 'Bate',
	createdAt: '2015-10-07 21-22:31'
};

Mysql.insert('user', insert)
	.then(function(info){
		console.log('New User Entered!', info);
	})
	.catch(function(err){
		console.log('Error creating new user, mysql error:', err.message);
	});

//info is an object with affectedRows and insertId

```
*There is also a boolean 3rd argument, true if you want "INSERT IGNORE"*


## Updating a record

```javascript

var where = {
	firstName: 'Greg',
	lastName: 'Bate'
};

var update = {
	lastSeen: '2015-10-07 21-54:58'
};

Mysql.update('user', where, update)
	.then(function(info){
		console.log('User Updated!', info);
	})
	.catch(function(err){
		console.log('Error updating record, mysql error:', err.message);
	});

//info is an object with affectedRows, changedRows

```

## Insert (on duplicate) update a record

*Used in case entering data conflicts with a unique index*

```javascript

var insert = {
	email: 'gdbate@gmail.com',
	firstName: 'Greg',
	lastName: 'Bate',
	lastSeen: '2015-10-07 21-49:58'
};

var update = {
	lastSeen: '2015-10-07 21-49:58'
};

Mysql.insertUpdate('user', insert, update)
	.then(function(info){
		console.log('New User Entered (or updated)!', info);
	})
	.catch(function(err){
		console.log('Error creating new user, mysql error:', err.message);
	});
//info is an object with affectedRows, changedRows and insertId (where applicable)

```

## Custom Queries

*Don't forget to release the pooled connection so another process can use it.*

```javascript

//query has sql structure
//values will be placed in the query when escaped, and are optional
Mysql.query(query, values)
	.then(function(results){
		console.log('my query results', results);
	})
	.catch(function(err){
		reject(err);
	});

```

The query values are used in the same way [felixge's module](https://github.com/felixge/node-mysql#escaping-query-values) expects it. They are also optional.

## Deleting a record

```javascript

//or select with an object
Mysql.delete('user', {id: 35})
	.then(function(record){
		console.log(record);
	})
	.catch(function(err){
		console.log('Error deleting record, mysql error:', err.message);
	});

```

## Utilities

```javascript

//Get last query (after escaping values)
var last = Mysql.getLastQuery();

//Escape a database,table or column name
var table = Mysql.escapeId(tableName);

//Escape a string
var noSqlInject = Mysql.escapeId(req.body.firstName);

```

## To Do

* Support ES6 Promises
* Inline documenation
* Some Spelcheking
* Limited convenience functions like YMD and DATETIME Functions
* Compatibility with RDB Select Module
* Make sure values are optional on custom query
* More Testing (heh)
