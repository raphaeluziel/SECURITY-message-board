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

mongoose.set('useFindAndModify', false);

var Schema = mongoose.Schema;

var replySchema = new Schema({
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    created_on: Date,
    reported: {type: Boolean, default: false }
});

var threadSchema = new Schema({
  board: {type: String, required: true},
  text: {type: String, required: true},
  delete_password: {type: String, required: true},
  created_on: Date,
  bumped_on: Date,
  reported: {type: Boolean, default: false },
  replies: [replySchema],
  replycount: {type: Number, default: 0}
});

var threadModel = mongoose.model('threadModel', threadSchema);

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  
  .get(function(req, res){
    var query = threadModel
    .find({board: req.params.board})
    .sort({bumped_on: 'descending'})
    .select('-delete_password')
    .select('-reported').limit(10);
    
    query.exec(function(err, data){
      if(err) {console.log('error executing');}
      else { return res.send(data); }
      });   
  })
  
  .post(function(req, res){
    var newThread = new threadModel({
      board: req.params.board,
      text: req.body.text,
      delete_password: req.body.delete_password,
      created_on: new Date(),
      bumped_on: new Date()
    });
    newThread.save(function(err, doc){
      if (err) { 
        console.log(err); 
        res.send('error saving new thread to database') }
      else{ 
        return res.redirect('/b/' + req.params.board + '/'); 
      }
    });
  })
  
  .put(function(req, res){
    threadModel.findByIdAndUpdate(req.body.report_id, {'reported': true}, function(err, data){
      if(err) {return console.log(err);}
      return res.send('reported');
    });
  })
  
  .delete(function (req, res){
    threadModel.findById(req.body.thread_id, function(err, doc){
      if(req.body.delete_password === doc.delete_password) {
        threadModel.deleteOne({_id: req.body.thread_id}, function(err){console.log(err);});
        return res.send('success');           
      } 
      else{
        return res.send('incorrect password');
      }
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  app.route('/api/replies/:board')
  
  .get(function(req, res){
    var query = threadModel
    .findById(req.query.thread_id)
    .select('-delete_password')
    .select('-reported');
    
    query.exec(function(err, data){ 
      var nestQuery = threadModel.findOne({_id: data._id}, {'replies.delete_password': 0, 'replies.reported': 0}).select('-delete_password').select('-reported');
      
      nestQuery.exec(function(err, doc){
        if (err) {
          console.log(err); 
          return res.send('error in finding subdocument'); 
        }
        else{ 
          res.send(doc); 
        }
      });
    });  
  })
    
  .post(function(req, res){
    threadModel.findOneAndUpdate({_id: req.body.thread_id}, { $push: { replies: {text: req.body.text, delete_password: req.body.delete_password, created_on: new Date()} } },  function(err, doc){
      if (err) { res.send('error saving reply to database'); }
      else{
        doc.replycount = doc.replies.length + 1; 
        doc.save(function(err, data){
          console.log("Updated reply count");
        });
        res.redirect('/b/' + req.params.board + '/' + doc._id); 
      }
    });  
  })
  
  .put(function(req, res){
    threadModel.findOneAndUpdate({_id: req.body.thread_id, 'replies._id': req.body.reply_id}, { $set: { 'replies.$.reported': true } }, function(err, data){
      res.send('reported');
    });
  })
  
  .delete(function (req, res){  
    threadModel.findById(req.body.thread_id, function(err, data){
      if (req.body.delete_password === data.replies.id(req.body.reply_id).delete_password) {
          data.replies.id(req.body.reply_id).text = '[deleted]';
          data.save(function(err, doc){
            console.log("DONE!!!!!");
          })
        res.send('success')
        console.log("good");
        return;
      }
      else{
        res.send('incorrect password');
      }
    });
  });
};
