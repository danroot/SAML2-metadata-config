# SAML2MetadataConfiguration

Metadata-based configuration of SAML login code is better than configuring URLs and certificates because it ensures certificates between a ID Provider and application stay in sync.  This project provides Metadata-based configuration of the passport-wsfed-saml2 strategy, though it could also be adopted to work with other platforms.

npm install saml2-medatada-config

Basic usage:    

    var Saml2MetadataConfiguration= require('saml2-metadata-config') 

    Saml2MetadataConfiguration.configure( {
      metadataUrl:'https://adfs.company.com/federationMetadata/2007-06/FederationMetadata.xml'     
    }).then(function(options){
        //options.identityProviderUrl and options.thumbprints populated.
    });
    
Full example:

    var passport = require('passport'); //auth library for express
    var WsFedSaml2Strategy= require('./node_modules/passport-wsfed-saml2/lib/passport-wsfed-saml2/index').Strategy; //WS-Federation/SAML plugin for passport
    var Saml2MetadataConfiguration= require('saml2-metadata-config') //Metadata Config library


    Saml2MetadataConfiguration.configure( {
      metadataUrl:'https://adfs.company.com/federationMetadata/2007-06/FederationMetadata.xml',
      realm: 'urn:your-relying-party-id,  //In ADFS this is the Relying Party Identifier - a URL or URN identifying your app
      wreply: 'https://thisapp.company.com/login/callback' //In ADFS, the root of this path (https://thisapp.company.com) must be one of the WS-Federation endpoints
    }).then(function(options){
          //Configure passport to use WSFED against ADFS
          passport.use('wsfed-saml2',  new WsFedSaml2Strategy(options,
              function (profile, done) {
                //Called when the user authenticates.  We could lookup a user in DB, etc.  For now, just pass the profile as the user.  
                console.log("Auth with", profile);
                if (!profile.email) {
                  return done(new Error("No email found"), null);
                }
                done(null, profile); //Profile doesn't have to = user, but for simplicity we do this here.  done(null,userFromDb) would also be possible
            }));
        },
       function(e){
          console.log(e);
         // throw "unable to configure using metadata"; //e; 
       });

