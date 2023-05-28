# getGitlabToken
 Get a personal connection token by username and password, for further comunication from gitlab


```js
import getGitlabToken from 'getGitlabToken';

// async wrapper if there is no top-level await support
(async()=> {

	let data = await getGitlabToken({
        appId: '71gnageeby118fc1vp2bkaxi2gkqm3wi9w3ti7w4d4w5lq588fjzcys0jnj68nqs',
        appSecret: 't1h2a5w8e1mgf8bn81u3ygjtgtnjbcrzo5kw359c6ue1onmxqyt9tiezb4485xcj',

        userName: 'bananaacid',
        userPassword: 'abcd12345',

        gitlabUrl: 'http://gitlab.test.local:1337',
	});

	console.info('OAuth personal login token:', data.token);
	console.info('Communication Data', data);
})();
```

For accessing GitLab, I used `@gitbeaker/node`
```js
const api = new Gitlab({ // gitbeaker instance
	host: gitlabUrl,
	oauthToken: data.token
});
```

For storing the user name and password in any OS key storage, I used `keytar`
