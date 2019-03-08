[![Build Status](https://travis-ci.org/DivanteLtd/open-loyalty.svg?branch=master)](https://travis-ci.org/DivanteLtd/open-loyalty)

# Open Loyalty

Open Loyalty is technology for loyalty solutions.
It's a loyalty platform in open source, with ready-to-use gamification and loyalty features, easy to set up and customize, ready to work on-line and off-line.

See Open Loyalty product tour - https://youtu.be/cDZZemHxgAk.

## Editions

Open Loyalty is available in two editions - Open Source and Enterprise.
Here you can find Open Source Edition. It is limited for projects with up to 200 members, does not provide guaranteed performance and scalability and therefore, it is recommended for testing purposes only. We strongly advise to use Enterprise Edition in commercial projects.

Enterprise Edition is not available publicly on GitHub.
To get the quotation, please visit www.openloyalty.io and send the request.

|                                | Open Source Edition         | Enterprise Edition                           |
| ------------------------------ | --------------------------- | -------------------------------------------- |
| Full access to the source code |  Yes                        | Yes                                          |
| Self-hosted                    |  Yes                        | Yes                                          |
| Customers limit                |  200                        | Unlimited                                    |
| Cockpits                       |  Admin Cockpit, POS Cockpit | Admin Cockpit, POS Cockpit, Client Cockpit   |
| Whitelabel                     |  No                         | Yes                                          |
| High performance               |  No                         | Yes                                          |
| Scalability                    |  No                         | Yes                                          |
| Producer's support             |  No                         | Product support, Technical support, Training |
| Updates                        |  No                         | Regular                                      |

## Business applications

There is variety of applications for Open Loyalty. Based on it you can build loyalty solutions like: loyalty modules for eCommerce, full loyalty programs for off-line and on-line, motivational programs for sales department or customer care programs with mobile application.

## Screenshots

![Admin Cockpit](https://user-images.githubusercontent.com/3582562/54033263-1db79500-41b4-11e9-8f2d-9b91acce50cf.png)
![Client Cockpit](https://user-images.githubusercontent.com/3582562/54033264-1db79500-41b4-11e9-984c-a954cd136d5c.png)
![Client Cockpit](https://user-images.githubusercontent.com/3582562/54033262-1db79500-41b4-11e9-88a6-e5449cb6782b.png)

## Quick install

This project has full support for running in [Docker](https://www.docker.com/>).

Go to the docker directory:

```
cd docker
```

Execute bellow command to run application: 

```
docker-compose up
```

Before you start using Open Loyalty you need to define hosts in your local environment. Add host openloyalty.localhost as 127.0.0.1 in your system configuration file (/etc/hosts).
If you find any problems using docker (for example on Windows environments) please try our Vagrant recipe.

## Quick install with Vagrant

You should have [Vagrant](https://www.vagrantup.com/downloads.html) and [Virtualbox](https://www.virtualbox.org/wiki/Downloads) installed prior to executing this recipe.

Then, please execute following commands:

```
vagrant up
vagrant ssh
docker-compose -f docker/docker-compose.yml up -d
docker-compose -f docker/docker-compose.yml exec --user=www-data php phing setup
```

That's all. Now you can go to admin panel [openloyalty.localhost:8182](http://openloyalty.localhost:8182).
Default login is **admin** and password **open**. You can also go to customer panel [openloyalty.localhost:8183](http://openloyalty.localhost:8183).

## Vagrant helpful commands

- `vagrant provision --provision-with sync` sync current dir
- `vagrant provision --provision-with build` rebuild docker base images

## Url access

After starting Open Loyalty it's exposes services under following URLs:

 * http://openloyalty.localhost:8182 - the administration panel,
 * http://openloyalty.localhost:8183 - the customer panel,
 * http://openloyalty.localhost:8184 - the merchant panel,
 * http://openloyalty.localhost - RESTful API port
 * http://openloyalty.localhost/doc - swagger-like API doc


## For developers

If you are developer and want to attach source code then you have to build base docker images:

```
./docker/base/build_dev.sh
```

and run containers:

```
docker-compose -f docker/docker-compose.dev.yml up
```

Remember about setup database using bellow command:

```
docker-compose -f docker/docker-compose.dev.yml exec --user=www-data php phing setup
```

After starting Open Loyalty in developer mode it's exposes services under slightly different URLs:

 * http://openloyalty.localhost:8081/admin - the administration panel,
 * http://openloyalty.localhost:8081/client - the customer panel,
 * http://openloyalty.localhost:8081/pos - the merchant panel,
 * http://openloyalty.localhost - RESTful API port
 * http://openloyalty.localhost/app_dev.php/doc - swagger-like API doc

## Generate JWT keys

Running `phing setup` will generate the JWT public/private keys for you, but in case you would like to generate them "manually" use `phing generate-jwt-keys`.

## Documentation

Technical documentation is located [here](backend/doc/index.rst). 

## CONTRIBUTING
If you wish to contribute to Open Loyalty, please read the CONTRIBUTING.md file.
