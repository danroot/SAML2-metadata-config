# WsFedSAML2MetadataConfiguration

Metadata-based configuration of SAML login code is better than configuring URLs and certificates because it ensures certificates between a ID Provider and application stay in sync.  This project provides Metadata-based configuration of the passport-wsfed-saml2 strategy, though it could also be adopted to work with other platforms.

To use:

    var passport = require('passport'); 
    var WsFedSaml2Strategy= require('./node_modules/passport-wsfed-saml2/lib/passport-wsfed-saml2/index').Strategy; //WS-Federation/SAML plugin for passport
    var WsFedSaml2MetadataConfiguration= require('WsFedSaml2MetadataConfiguration') //Metadata Config library


    WsFedSaml2MetadataConfiguration( {
      metadataUrl:'https://adfs.company.com/federationMetadata/2007-06/FederationMetadata.xml',
      realm: 'urn:your-relying-party-id,
      wreply: 'https://thisapp.company.com/login/callback'
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
`
