[ESPN Bowl Mania](http://games.espn.go.com/college-bowl-mania/) scoring scraper, using node.io for the scraping and Express to return formatted JSON. Deploys to Heroku or OpenShift.

This is used as the basis for http://kulturny.com/bowls/

Live example: http://bowlmania-openshift.kulturny.com/bowlmania.json

###OpenShift

####Deploy

```
rhc app create bowlmania nodejs-0.10 --from-code=http://github.com/friedbunny/bowlmania.git
```

####Update

1. Clone the OpenShift repo:

  ```git clone ssh://53324ab1e0b8cd9dc0000098@bowlmania-kulturny.rhcloud.com/~/git/bowlmania.git/```

2. Add Github as a remote repo:

  ```git remote add github https://github.com/friedbunny/bowlmania.git```

3. Pull the new hotness from Github into your local repo:

  ```git pull github master```

4. Push the changes up to OpenShift:

  ```git push origin master```


... and the full process in action:

```shell
jason@Keaton ~/ $ git clone ssh://53324ab1e0b8cd9dc0000098@bowlmania-kulturny.rhcloud.com/~/git/bowlmania.git/
Cloning into 'bowlmania'...
remote: Counting objects: 118, done.
remote: Compressing objects: 100% (66/66), done.
remote: Total 118 (delta 54), reused 104 (delta 45)
Receiving objects: 100% (118/118), 33.36 KiB | 0 bytes/s, done.
Resolving deltas: 100% (54/54), done.
Checking connectivity... done.
jason@Keaton ~/ $ cd bowlmania/
jason@Keaton ~/bowlmania $ git remote -v
origin	ssh://53324ab1e0b8cd9dc0000098@bowlmania-kulturny.rhcloud.com/~/git/bowlmania.git/ (fetch)
origin	ssh://53324ab1e0b8cd9dc0000098@bowlmania-kulturny.rhcloud.com/~/git/bowlmania.git/ (push)
jason@Keaton ~/bowlmania $ git remote add github https://github.com/friedbunny/bowlmania.git
jason@Keaton ~/bowlmania $ git pull github master
remote: Counting objects: 6, done.
remote: Total 6 (delta 0), reused 0 (delta 0), pack-reused 5
Unpacking objects: 100% (6/6), done.
From https://github.com/friedbunny/bowlmania
 * branch            master     -> FETCH_HEAD
 * [new branch]      master     -> github/master
Updating b4f93bc..63a8a47
Fast-forward
 README.md | 11 ++++++-----
 server.js | 13 ++++++++++---
 2 files changed, 16 insertions(+), 8 deletions(-)
jason@Keaton ~/bowlmania $ git push origin master
Counting objects: 9, done.
Delta compression using up to 8 threads.
Compressing objects: 100% (6/6), done.
Writing objects: 100% (6/6), 838 bytes | 0 bytes/s, done.
Total 6 (delta 4), reused 0 (delta 0)
remote: Stopping NodeJS cartridge
remote: Wed Mar 04 2015 00:36:38 GMT-0500 (EST): Stopping application 'bowlmania' ...
remote: Wed Mar 04 2015 00:36:40 GMT-0500 (EST): Stopped Node application 'bowlmania'
remote: Saving away previously installed Node modules
remote: Building git ref 'master', commit 63a8a47
remote: Building NodeJS cartridge
remote: npm info it worked if it ends with ok
remote: npm info using npm@1.3.24
remote: npm info using node@v0.10.25
remote: npm info preinstall bowlmania@0.0.1
remote: npm info build /var/lib/openshift/53324ab1e0b8cd9dc0000098/app-root/runtime/repo
remote: npm info linkStuff bowlmania@0.0.1
remote: npm info install bowlmania@0.0.1
remote: npm info postinstall bowlmania@0.0.1
remote: npm info prepublish bowlmania@0.0.1
remote: npm info ok 
remote: Preparing build for deployment
remote: Deployment id is 0251b089
remote: Activating deployment
remote: Starting NodeJS cartridge
remote: Wed Mar 04 2015 00:37:12 GMT-0500 (EST): Starting application 'bowlmania' ...
remote: -------------------------
remote: Git Post-Receive Result: success
remote: Activation status: success
remote: Deployment completed with status: success
To ssh://53324ab1e0b8cd9dc0000098@bowlmania-kulturny.rhcloud.com/~/git/bowlmania.git/
   b4f93bc..63a8a47  master -> master

```
