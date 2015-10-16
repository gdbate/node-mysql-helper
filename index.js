;(function(){

// Dependancies ===============

  var Q = require('q'),
    Mysql = require('mysql');

// Library ====================

  var mysqlHelper = {};

// Wrapper ====================

  mysqlHelper.connect = function(options, connections){
    options.connectionLimit = connections || 1;
    this.pool = Mysql.createPool(options);
  }

  mysqlHelper.connection = function(){
    var self = this;
    return Q.promise(function(resolve, reject){
      if(!self||!self.pool)return reject(new Error('Unknown Error'));
      self.pool.getConnection(function(err, connection){
        return err ? reject(err) : resolve(connection);
      });
    });
  }

  mysqlHelper.query = function(query, values){
    var self = this;
    return Q.promise(function(resolve, reject){
      self.connection()
        .then(function(connection){
          connection.query(query, values, function(err, results){
            connection.release();
            return err ? reject(err) : resolve(results);
          });
        })
        .catch(function(err){
          reject(err);
        });
    });
  }

  mysqlHelper.idOrPairs=function(index){
    return (typeof(index) == 'object') ? index : {id: index};
  }

  mysqlHelper.end = function(query, values){
    var self = this;
    return Q.promise(function(resolve, reject){
      self.pool.end(function(err){
        return err ? reject(err) : resolve(connection);
      });
    });
  }

  mysqlHelper.record = function(table, index){
    var query = 'SELECT * FROM ' + Mysql.escapeId(table) + ' WHERE ?';
    var values = [this.idOrPairs(index)];
    return this.query(query, values);
  }

  mysqlHelper.insert = function(table, record, ignore){
    var query = 'INSERT' + (ignore ? ' IGNORE' : '' ) + ' INTO ' + Mysql.escapeId(table) + ' SET ?';
    return this.query(query, record);
  }

  mysqlHelper.update = function(table, index, record){
    var query = 'UPDATE ' + Mysql.escapeId(table) + ' SET ? WHERE ?';
    var values = [record, this.idOrPairs(index)];
    return this.query(query, values);
  }

  mysqlHelper.insertUpdate = function(table, recordInsert, recordUpdate){
    var query = 'INSERT INTO ' + Mysql.escapeId(table) + ' SET ? ON DUPLICATE KEY UPDATE ?';
    var values = [recordInsert, recordUpdate];
    return this.query(query, values);
  }

  mysqlHelper.delete = function(table, index){
    var query = 'DELETE FROM ' + Mysql.escapeId(table) + ' WHERE ?';
    var values = [this.idOrPairs(index)];
    return this.query(query, values);
  }

// Utils ======================

  mysqlHelper.escapeId = function(id){
    return Mysql.escapeId(id);
  }

  mysqlHelper.escape = function(value){
    return Mysql.escape(value);
  }

// Export =====================

  module.exports = mysqlHelper;

}());
