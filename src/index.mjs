/**
 * connects to gitlab using username and password, requires an app-id and secret to be created at the gitlab server.
 * returns an oauth token for the now logged in user.
 **/

import https from 'https';
import http from 'http';

/**
 * retrieves the connection token
 * @param options
 * @returs {Promise<{statusCode,token,data,error}>} a promise with the token or error
 * @note : the default gitlab installs (e.g. through containers) usually have the CORS header missing (a problem in WebApps). But the API routes don't have this bug.
 **/
export default function getGitlabToken(options) {

    const opts = {
        appId: null,
        appSecret: null,

        userName: null,
        userPassword: null,

        gitlabUrl: null,

        ...options
    }

    const url = new URL(opts.gitlabUrl);

    const postData = JSON.stringify({
        grant_type: 'password',
        username: opts.userName,
        password: opts.userPassword
    });

    const conOptions = {
        hostname: url.hostname,
        port: url.port,
        path: '/oauth/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'Authorization': 'Basic ' + new Buffer(opts.userName + ':' + opts.userPassword).toString('base64')
        } 
    };


    const con = url.protocol === 'https:' ? https : http;

    const data = new Promise((resolve, reject) => {
        let retData = {statusCode: null, token: null, data: null, error: null};

        let req = (con).request(conOptions, (res) => {
            let data = '';

            retData.statusCode = res.statusCode;

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                let jsonData = JSON.parse(data);
                retData.data = jsonData;
                retData.token = jsonData.access_token;
                resolve(retData);
            });

        }).on("error", (err) => {
            retData.error = err;
            console.error(err.message);
            resolve(retData);
        });

        req.write(postData);
        req.end();
    });

    return data;

}