![Heroku](https://heroku-badge.herokuapp.com/?app=github-deploy-proxy)

# github-deploy-proxy

This package acts as a simple proxy for github `dispatch_event`

The problem it's trying to solve is the fact that most CMS Webhooks don't offer the option of sending an encoded body as a Webhook.
This solution is a proxy for webhooks. For instance, the CMS would send a request to this tool with:

```js
GITHUB_TOKEN= ...
GITHUB_USER=sabinmarcu
GITHUB_REPO=github-deploy-proxy

[EVENT_TYPE]=my_custom_deploy_event
```

The first three parameters are required (as the GH API requires them, as well), while `EVENT_TYPE` is optional, and defaults to `deploy`;

What will happen next is that the proxy will re-engineer the request to be sent to Github API with the proper structure.
