ESPN Bowl Mania scoring scraper, using node.io for the scraping and Express to return formatted JSON. Deploys to Heroku or OpenShift.

Heroku: http://bowlmania.kulturny.com/bowlmania.json

OpenShift: http://bowlmania-openshift.kulturny.com/bowlmania.json
`rhc app create bowlmania nodejs-0.10 --from-code=http://github.com/friedbunny/bowlmania.git`
 
This is used as the basis for http://kulturny.com/bowls/