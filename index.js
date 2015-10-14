;(function(){

// Dependancies ===============

  var Q = require('q'),
    Mysql = require('mysql');

// Dependancies ===============

  module.exports = mysqlWrapper();

// Dependancies ===============

  function mysqlWrapper(options){
    this.options = options || {};
    return this;
  }

  mysqlWrapper.prototype.connect = function(options, connections){
    if(typeof options == 'object')
      this.options=options;
    this.options.connectionLimit = connections || 1;
    this.pool = Mysql.createPool(this.options);
    return this;
  }

  mysqlWrapper.prototype.connection = function(){
    var self = this;
    return Q.promise(function(resolve, reject){
      self.pool.getConnection(function(err, connection){
        return err ? reject(err) : resolve(connection);
      });
    });
  }

  mysqlWrapper.prototype.query = function(query, values){
    var self = this;
    return Q.promise(function(resolve, reject){
      self.connection()
        .catch(function(err){
          reject(err);
        })
        .then(function(connection){
          connection.query(query, values, function(err, results){
            connection.release();
            return err ? reject(err) : resolve(results);
          });
        })
    });
  }

  mysqlWrapper.prototype.idOrPairs=function(index){
    return (typeof(index) == 'object') ? index : {id: index};
  }

  mysqlWrapper.prototype.end = function(query, values){
    var self = this;
    return Q.promise(function(resolve, reject){
      self.pool.end(function(err){
        return err ? reject(err) : resolve(connection);
      });
    });
  }

  mysqlWrapper.prototype.record = function(table, index){
    var query = 'SELECT * FROM ' + Mysql.escapeId(table) + ' WHERE ?';
    var values = [this.idOrPairs(index)];
    return this.query(query, values);
  }

  mysqlWrapper.prototype.insert = function(table, record, ignore){
    var query = 'INSERT' + (ignore ? ' IGNORE' : '' ) + ' INTO ' + Mysql.escapeId(table) + ' SET ?';
    return this.query(query, record);
  }

  mysqlWrapper.prototype.update = function(table, index, record){
    var query = 'UPDATE ' + Mysql.escapeId(table) + ' SET ? WHERE ?';
    var values = [this.idOrPairs(index), record];
    return this.query(query, values);
  }

  mysqlWrapper.prototype.insertUpdate = function(table, recordInsert, recordUpdate){
    var query = 'INSERT INTO ' + Mysql.escapeId(table) + ' SET ? ON DUPLICATE KEY UPDATE ?';
    var values = [recordInsert, recordUpdate];
    return this.query(query, values);
  }

}());
