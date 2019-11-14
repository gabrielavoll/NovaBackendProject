const express = require('express');
var router = express.Router();
var queries = require('../db/queries.js');
const tools = require('../db/tools.js');

const file_ext_to_header = { '.json': 'application/json'};

function apiEndPointHolder(req, res){
  res.status(200);
  res.set('Content-Type', 'text/plain');
  res.send(req.url);
}

function validatePhase1(req, res, next){
	var params = req.query;
	if( !params.country_code || !params.tags || !params.file_ext || !params.account_id || !params.routing_number )
		return res.status(400).send("params country_code, tags, file_ext, account_id, routing_number are required to fulfill request /phase1")
	var tags = params.tags.split(',').filter( x => x != "");
	if( params.country_code.length != 3 )
		return res.status(400).send("valid country_code is 3 chars long")
	if( params.file_ext != '.json' )
		return res.status(400).send("the only valid file_ext is .json")
	if( tags.length < 2 || params.tags.length > 500)
		return res.status(400).send("you must supply at least two tag, formated as a comma seperated string, and fewer then 500 chars total")
	if( params.account_id.length > 10 )
		return res.status(400).send("valid account_id is less then 10 chars")
	if( tags.routing_number > 10)
		return res.status(400).send("valid routing_number is less then 10 chars")

	next();
}

function phase1(req, res){
	var params = req.query;
	var token = tools.tokenGen();
	var newRecord = [params.file_ext, params.country_code, params.tags, token, params.account_id, params.routing_number];
	queries.createTransferInitRecord(newRecord)
		.catch( err => {
			return res.status(500).send("Failed to save /phase1 data");
		}).then( response => {
			if( response == 1)  {
				// 5 min cookie
				res.cookie('token',token, { maxAge: 1000 * 60 * 5, httpOnly: false })
				return res.status(200).send('success: proceed to /phase2')
			} else return res.status(500).send("Failed to save /phase1 data");
		});
}

function validatePhase2(req, res, next){
	var token = req.cookies['token'] || null;
	var body = req.body;

	if( !token)
		return res.status(400).send("cookie token is required to fulfill request /phase2, hit /phase1 first")
	if( !body || body == {} )
		return res.status(400).send("please uploade a file for /phase2")
	if( !body.country_code || !body.first_name || !body.last_name || !body.account_id || !body.routing_number || !body.credit_score || !body.credit_limit )
		return res.status(400).send("document uploaded must inclue; country_code, first_name, last_name, account_id, routing_number, credit_limit, credit_score are required to fulfill request /phase1")
	if( body.country_code.length != 3 )
		return res.status(400).send("valid country_code is 3 chars long")
	if( body.first_name.length > 100 )
		return res.status(400).send("valid first_name is less then 100 chars")
	if( body.last_name.length > 100 )
		return res.status(400).send("valid last_name is less then 100 chars");
	if( body.routing_number.length > 10 )
		return res.status(400).send("valid routing_number is less then 10 chars")
	if( body.account_id.length > 10 )
		return res.status(400).send("valid account_id is less then 10 chars")

	queries.getTransferInitRecord(token)
		.catch( (err) => {
			return res.status(401).send('counldnt validate token, please hit /phase1 again ');
		}).then( transferRecord => {
			if(transferRecord && transferRecord.token == token){
				req.pendingRecord = transferRecord;
				if(  file_ext_to_header[transferRecord.file_ext] != req.headers['content-type']  )
					return res.status(400).send('file uploaded doesnt match file type meta data from /phase1')
				if(  transferRecord.country_code != body.country_code )
					return res.status(400).send('country_code in file uploaded doesnt match meta data from /phase1')
				if(  transferRecord.account_id != body.account_id )
					return res.status(400).send('account_id in file uploaded doesnt match meta data from /phase1')
				if(  transferRecord.routing_number != body.routing_number )
					return res.status(400).send('routing_number in file uploaded doesnt match meta data from /phase1')
				next()
			} else {
				return res.status(401).send('counldnt validate token, please hit /phase1 again ');
			}
		});
}

function phase2(req, res){
	var body = req.body;
	var newRecord = [
		req.pendingRecord.file_ext,
		body.country_code,
		body.account_id,
		body.routing_number,
		body.first_name,
		body.last_name,
		body.credit_score,
		body.credit_limit,
		req.pendingRecord.date_t,
		req.pendingRecord.tags
	];

	queries.createTransferRecord(newRecord)
		.catch( err => {
			return res.status(500).send("Failed to save new data");
		}).then( response => {
			if( response == 1 ) return queries.deleteTransferStatusRecord(req.cookies['token']);
			else return res.status(500).send("Failed to save new data");
		}).catch( err => {
			return res.status(500).send("Failed to delete pending record")
		}).then( response2 => {
			if(response2 > 0)
				return queries.getTransferRecord(body.account_id, body.routing_number, body.country_code);
			else
				return res.status(500).send("Failed to delete pending record");
		}).catch( err => {
			return res.status(500).send("Failed to get saved data");
		}).then( response1 => {
			if(response1 && response1.account_id == body.account_id)
				return res.status(200).send('success: proceed to data/' + response1.id );
			else return res.status(500).send("Failed to get saved data");
		});
}


function displayData(req, res){
	if( parseInt(req.params.id) == NaN)
		return res.status(400).send('data id is invalid, must be integer')

	queries.getTransferRecordById(req.params.id)
		.catch( err => {
			return res.status(400).send("Failed to find data, with that id");
		}).then( response => {
			if( response && response.id == req.params.id ) return res.status(200).send(response);
			else return res.status(400).send("Failed to find data, with that id");
		});
}


router.post( "/phase2", validatePhase2, phase2);
router.get( "/phase1", validatePhase1, phase1);
router.get( "/phase2", apiEndPointHolder);
router.get( "/data/:id", displayData);

module.exports = router;