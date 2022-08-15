# User tracking service  
  

This project consists of:  

- **Tracking service** - Typescript Express app connected to a MySql cluster MariaDB and a  Pub/sub system Kafka.
- **MariaDB  cluster** - MySql cluster which contains table users with users data.
- **Kafka** - Pub/sub system.
- **Cli client** - Typescript script that runs Kafka consumer.
  

For more information on **Tracking service** check `TrackingService/README.md` .  
  

## Requires  

- Docker  
- Docker Compose  
- Node  

## Build and run Tracking service, Kafka and MariaDB cluster  
  

First build services with:  

```bash  
sudo docker-compose build  
```  

And then run them with:  

```bash  
sudo docker-compose up --build --scale tracking_service=x --scale mariadb-galera=y  
```  

Where x is the number of tracking_service container instances and y is the number of replicas in the cluster. If scale  
parameters are not define they will default to 1.  
  

Tracking services can be reached through nginx load balancer listening at localhost at port 8080.  
  

Tracking service has one GET endpoint at "/<*accountId*>?*data=<*data*>" which receives path parameter *accountId* and  
query string parameter *data*. If a user with id *accountId* exists in MariaDB cluster and has isActive value set to True then  
tracking service sends *accountId*, *data* and a timestamp to Kafka to topic *users-tracked*.   
  

## Build and run Cli client  

Go to folder `CliClient` and then install dependencies with:  

  ```bash  
NPM i  
```  

And then run client with  

  ```bash  
NPM start  
```  

This will start a Kafka consumer with base parameter where consumer group id is *my-group* and there is no filter for user ids.  
To set custom parameters instead run client with:  

  ```bash  
tsc  
node ./dist/kafka_consumer.js --group_id group_id --filter one_id,anotherid  
```  

Where you can define consumer group id and pass a list of user ids separated with comma for which the consumer will  
log messages.  
  

## Test Tracking service, Kafka, MariaDB cluster and Cli client  
  

First build services with:  

```bash  
sudo docker-compose -f docker-compose_test.yml build  
```  

And then run them with:  

```bash  
sudo docker-compose -f docker-compose_test.yml up --build --scale tracking_service=x --scale mariadb-galera=y  
```  

Where x is the number of tracking_service container instances and y is the number of replicas in the cluster. If scale  
parameters are not defined they will default to 1.  
  

If tests were successful then the containers containing tracking_service instances and cli_client container will exit with  
 exit code 0. If tests were not successful then they will exit with code 1.  

# User tracking service

This project consists of:

-   **Tracking service**  - Typescript express app connected to a MySql cluster MariaDB and a Pub/sub system Kafka
-   **MariaDB cluster**  - MySql cluster containing table users with users data
-   **Kafka**  - Pub/sub system
-   **Cli client**  - Typescript script that runs Kafka consumer

For more information on  **Tracking service**  and  **Cli client**  check  [README.md](http://readme.md/)  in their respective folder.

## Requires

-   Docker
-   Docker Compose
-   Node

## Build and run Tracking service, Kafka and MariaDB cluster

First build services with:

```bash
sudo docker-compose build

```

And then run them with:

```bash
sudo docker-compose up --build --scale tracking_service=x --scale mariadb-galera=y

```

Where x is the number of tracking_service container instances and y is the number of mariadbDBs in a cluster. If scale  
parameters are not define they will default to 1.

Tracking services can be reached through nginx load balancer listening at localhost at port 80.

Tracking service has one GET endpoint at “/<_accountId_>*data=<_data_>” which receives path parameter  _accountId_  and  
query string parameter  _data_. If a user with id  _accountId_  exists in MariaDB cluster and has isActive value set to True then  
tracking service sends  _accountId_,  _data_  and a timestamp to Kafka to topic  _users-tracked_.

## Build and run Cli client

Go to folder  `CliClient`  and then install dependencies with:

```bash
NPM i

```

And then run client with

```bash
NPM start

```

This will start a Kafka consumer with base parameter where consumer group id is  _my-group_  and there is no filter for user ids.  
To set custom parameters instead run client with:

```bash
tsc
node ./dist/kafka_consumer.js --group_id group_id --filter one_id,anotherid

```

Where you can define consumer group id and pass a list of user ids separated with comma for which the consumer will  
log messages.

## Test Tracking service, Kafka, MariaDB cluster and Cli client

First build services with:

```bash
sudo docker-compose -f docker-compose_test.yml build

```

And then run them with:

```bash
sudo docker-compose -f docker-compose_test.yml up --build --scale tracking_service=x --scale mariadb-galera=y

```

Where x is the number of tracking_service container instances and y is the number of mariadb DBs in a cluster. If scale  
parameters are not defined they will default to 1.

If tests were successful then the containers containing tracking_service instances and cli_client container will exit with  
exit code 0. If tests were not successful then they will exit with code 1.