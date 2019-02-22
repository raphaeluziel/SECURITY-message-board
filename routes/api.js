/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true });

var Schema = mongoose.Schema;

var threadSchema = new Schema({
  board: {type: String, required: true},
  text: {type: String, required: true},
  delete_password: {type: String, required: true},
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  replies: [String]
});

var threadModel = mongoose.model('threadModel', threadSchema);

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  
  .get(function(req, res){
    var query = threadModel.find({board: req.params.board})
    
    query.exec(function(err, data){
      if(err) {console.log('error executing');}
      else { return res.send(data); }
      });  
      
  })
  
  .post(function(req, res){
    var newThread = new threadModel({
      board: req.body.board,
      text: req.body.text,
      delete_password: req.body.delete_password,
      created_on: new Date(),
      bumped_on: new Date()
    });
    newThread.save(function(err, doc){
      if (err) { res.send('error saving new thread to database') }
      else{ 
        //res.json({_id: doc._id, text: doc.text, created_on: doc.created_on, bumped_on: doc.bumped_on, reported: false, delete_password: doc.delete_password, replies: doc.replies});
        res.redirect('/b/' + req.body.board); 
      }
    });
  })
  
  .delete(function (req, res){    
      if (!req.body.delete_password) { res.send('incorrect password'); }
      else{
        threadModel.findOneAndDelete({delete_password: req.body.delete_password}, function(err, data){
          if (err) { res.send('could not delete'); }
          res.send('success');
        }); 
      }
    });

  
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  app.route('/api/replies/:board')
    
  .post(function(req, res){
    
    threadModel.findByIdAndUpdate(req.body._id, {replies: 'HELL HELL HELL'}, function(err, doc){
      
      //doc.replies.push('heaven');
      
      if (err) { res.send('error saving reply to database'); }
      else{ 
        //res.send(doc);
        //res.json({_id: doc._id, text: doc.text, created_on: doc.created_on, bumped_on: doc.bumped_on, reported: false, delete_password: doc.delete_password, replies: 'poplice'});
        //res.redirect('/b/' + req.body.board + '/' + req.body._id); 
      }
    });
    
    
    
  });

};
