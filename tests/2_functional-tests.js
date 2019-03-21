/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  var threadIDA, threadIDB, repID;

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('thread A exists', function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'chai testing A',
          delete_password: 'passwd'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('POST and do not delete', function() {
      test('thread B exists', function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'chai testing B',
          delete_password: 'passwd'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('Get threads',  function(done){
        chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res){
          threadIDA = res.body[0]._id;
          threadIDB = res.body[1]._id;
          assert.equal(res.status, 200);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'created_on');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('Report a thread',  function(done){
        chai.request(server)
        .put('/api/threads/test')
        .send({
          reported: true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      
      test('delete a thread using wrong password', function(done){
        chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: threadIDA, 
          delete_password: 'wrong'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('delete a thread', function(done){
        chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: threadIDA, 
          delete_password: 'passwd'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
    });
    

  });
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('reply exists', function(done) {
        chai.request(server)
        .post('/api/replies/test')
        .send({
          board: 'test',
          thread_id: threadIDB,
          text: 'chai testing replies',
          delete_password: 'passwd'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('Get replies',  function(done){
        chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res){
          repID = res.body[0].replies[0]._id;
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'replies');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0].replies[0], 'delete_password');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('Report a reply',  function(done){
        chai.request(server)
        .put('/api/replies/test')
        .send({
          thread_id: threadIDB,
          reply_id: repID,
          reported: true
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('delete a reply', function(done){
        chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: threadIDB, 
          reply_id: repID,
          delete_password: 'passwd'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
      test('cleanup', function(done){
        chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: threadIDB, 
          delete_password: 'passwd'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
  });

});
