var crypto    = require('crypto');
var https = require('https');
var url = require('url');
var util = require('util');

//TODO: Cache metadata
var Saml2MetadataConfiguration = function(options){
  var self = this;
  var xpath = require('xpath');
  var dom = require('xmldom').DOMParser;

  this.options = options;
  this.handleMetadata = function(metadata){   
    process.env[url] = metadata;
    var doc = new dom().parseFromString(metadata)
    self.options.thumbprints = [];
    var certs = xpath.select("//IDPSSODescriptor/KeyDescriptor[@use='signing']/KeyInfo/X509Data/X509Certificate", doc);    
    //Assumes first SSO URL - should possibly limit by binding type
    self.options.identityProviderUrl = xpath.select("//IDPSSODescriptor/SingleSignOnService/@Location",doc)[0].value.toString();   
    certs.forEach(function(node){
          var shasum = crypto.createHash('sha1');
          var der = new Buffer(node.firstChild.data, 'base64').toString('binary');
          shasum.update(der,'latin1');
          self.options.thumbprints.push(shasum.digest('hex'));
    });  
    return options;
  };
  
  this.getMetadata = function(options){
    return new Promise(function(resolve, reject){
      var metadata = process.env[options.metadataUrl];
      if(metadata){
         resolve(metadata);    
      }else{
        var urlParsed = url.parse(options.metadataUrl);
        var metadataRequest = https.get({host:urlParsed.hostname, path:urlParsed.path, port:443}, function(res){  
          var body = ''; 
          res.on('data', (chunk) => {
             body += chunk.toString('utf8');
           });
          res.on('end', function() {
             resolve(body);
          });
          res.on('error', function(e) {
            console.log("hi");
             reject(e); //TODO: You are here.  this isn't workin.
          }); //TODO: Error case?
        });
        metadataRequest.end();
      }
    });
    
  };
  
  return new Promise(function(resolve, reject){
    self.getMetadata(options)
        .then(function(metadata){
          resolve(self.handleMetadata(metadata));
        },function(e){
          reject(e);
        });
  });
};

exports = Saml2MetadataConfiguration;
