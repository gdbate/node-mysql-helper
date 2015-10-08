# node-mysql-helper

A lightweight Promise-based wrapper and helper for felixge's node-mysql.

##Features:

* Very slim library, only 2 dependancies ([Q](https://github.com/kriskowal/q) and [felixge's node-mysql](https://github.com/felixge/node-mysql)).
* Convenience functions for record selecting, inserting, updating and insert (on duplicate) updating.
* Connection pooling.
* Everything based on Promises

##Initialize

Format you connection options based on [felixge's options](https://github.com/felixge/node-mysql#connection-options).

```javascript

var MysqlHelper = require('node-mysql-helper');

var mysqlOptions = {
	host: 'localhost',
	user: 'root',
	password: 'chicken',
	socketPath: false
}

//For 5 pooled connections
var Mysql = new Mysqlhelper().connect(mysqlOptions, 5);

```
## Selecting a record

```javascript

//find user id 35
Mysql.record('user', 35);
	.catch(function(err){})
	.then(function(record){
		console.log(record);
	});

//or select with an object
Mysql.record('user', {id: 35});
	.catch(function(err){})
	.then(function(record){
		console.log(record);
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
	.catch(function(err){
		console.log('Error creating new user, mysql error:', err.message);
	})
	.then(function(info){
		console.log('New User Entered!', info);
	});

//info is an object with affectedRows and insertId

```
*There is also a boolean 3rd argument, true if you want "INSERT IGNORE"*


## Updating a record

```javascript

var update = {
	lastSeen: '2015-10-07 21-54:58'
};

Mysql.insertUpdate('user', { firstName: 'Greg', lastName: 'Bate' }, update)
	.catch(function(err){
		console.log('Error creating new user, mysql error:', err.message);
	})
	.then(function(info){
		console.log('User Updated!', info);
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
	.catch(function(err){
		console.log('Error creating new user, mysql error:', err.message);
	})
	.then(function(info){
		console.log('New User Entered (or updated)!', info);
	});
//info is an object with affectedRows, changedRows and insertId (where applicable)

```

## Custom Queries

*Don't forget to release the pooled connection so another process can use it.*

```javascript

//fetch a connection from the pool	
self.connection()
	.catch(function(err){
		reject(err);
	})
	.then(function(connection){
		//run a query on a successfully obtained connection
		connection.query(query, values, function(err, results){
			connection.release();
			return err ? reject(err) : resolve(results);
		});
	})

```

The query values are used in the same way [felixge's module](https://github.com/felixge/node-mysql#escaping-query-values) expects it. They are also optional.

## Deleting a record

Personally I never delete, I set a field to deletedAt or status = deleted. If you want this feature, let me know, or add it!

## To Do

* Delete method
* Inline documenation
* Some Spelcheking
* Easier access to escape methods
* Limited convenience functions like YMD and DATETIME Functions
* Compatibility with RDB Select Module
* Make sure values are optional on custom query
* More Testing (heh)

