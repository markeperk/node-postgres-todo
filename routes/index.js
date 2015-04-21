var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.post('/api/v1/todos', function(req, res) {
	var results = [];

	//grab data from http request
	var data = {text: req.body.text, complete: false};

	//Get a postgres client from the connection pool
	pg.connect(connectionString, function(err, client, done) {
		//SQL query > insert data
		client.query("INSERT INTO items(text, complete) values ($1, $2)", [data.text, data.complete]);
		//SQL query > select data
		var query = client.query("SELECT * FROM items ORDER BY id ASC");
		//Stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});
		//After all data is returned, close connection and return result
		query.on('end', function() {
			client.end();
			return res.json(results);
		});

		//handle errors
		if (err) {
			console.log(err);
		}
	});
});

router.get('/api/v1/todos', function(req, res) {
	var results = [];
	//Get a postgres client from the connection pool
	pg.connect(connectionString, function(err, client, done) {
		//sql query > select data
		var query = client.query("SELECT * FROM items ORDER BY id ASC;");
		//stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});
		//after all data is returned, close connection and return results
		query.on('end', function() {
			client.end();
			return res.json(results);
		});
		//handle errors
		if(err) {
			console.log(err);
		}
	});
});

router.put('/api/v1/todos/:todo_id', function(req, res) {
	var results = [];
	//grab data from the url parameters
	var id = req.params.todo_id;
	//grab data from http request
	var data = {text: req.body.text, complete: req.body.complete};
	//get postgres client from connection pool
	pg.connect(connectionString, function(err, client, done) {
		//sql query > update data
		client.query("UPDATE items SET text=($1), complete=($2) WHERE id=($3)", [data.text, data.complete, id]);
		//sql query > select data
		var query = client.query("SELECT * FROM items ORDER BY id ASC");
		//stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});
		//after all data is returned, close connection and return result
		query.on('end', function() {
			client.end();
			return res.json(results);
		});
		//handle errors
		if(err) {
			console.log(err);
		}
	});
});

router.delete('/api/v1/todos/:todo_id', function(req, res) {
	var results = [];
	//grab data from the url parameters
	var id = req.params.todo_id;
	//get a postgres client from the connection pool
	pg.connect(connectionString, function(err, client, done) {
		//sql query > delete the data
		client.query("DELETE FROM items WHERE ID=($1)", [id]);
		//sql query > select data
		var query = client.query("SELECT * FROM items ORDER BY id ASC");
		//stream results back one row at a time
		query.on('row', function(row) {
			results.push(row);
		});
		//after all data is returned, close connection and return result
		query.on('end', function() {
			client.end();
			return res.json(results);
		});
		//handle errors
		if(err) {
			console.log(err);
		}
	});
});




module.exports = router;







