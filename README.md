ESPN Bowl Mania scoring scraper, using node.io for the scraping and Express to return formatted JSON. Deploys to Heroku or OpenShift.

This is used as the basis for http://kulturny.com/bowls/

**Deploy to OpenShift**

```
rhc app create bowlmania nodejs-0.10 --from-code=http://github.com/friedbunny/bowlmania.git
```
