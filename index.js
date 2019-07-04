const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');

module.exports = (opts) => {
    const url_to_fetch = encodeURI(opts.url);
    const path_to_write = opts.pathtowrite;
    const access_key = opts.accesskey;
    var viewport = '';
    var hashed_key = '';

    if (!opts.viewport){
        viewport = '1440x900';
    }
    else{
        viewport = opts.viewport;
    }

    if (opts.secretkey){
        hashed_key = crypto.createHash('md5').update(url_to_fetch + opts.secretkey).digest("hex");
    }


    return new Promise(function (resolve,reject){

        axios.get('http://api.screenshotlayer.com/api/capture' , {
            params:{
                access_key: access_key,
                url: url_to_fetch,
                viewport: '1440x900',
                secret_key: hashed_key
            },
            responseType: 'stream'
        })
            .then(function(response){
                response.data.pipe(fs.createWriteStream(path_to_write)).on('finish' , function(done){ resolve(); });
            })
            .catch(function(err){
                reject(err);
            });

    }) // Close promise
};