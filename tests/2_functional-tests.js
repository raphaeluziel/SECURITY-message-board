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

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('thread exists', function(done) {
        chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'chai testing',
          delete_password: 'passwd'
        })
        .end(function(err, res){
          console.log("RES.BODY", res.body);
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.text, 'text');
          done();
        });
      });
      
    });
    
    suite('GET', function() {

    });
    
    suite('DELETE', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
