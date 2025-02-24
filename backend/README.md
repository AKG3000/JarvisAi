# JarvisAi
This is a test project for personalized alerts and reminders


First set up local docker environment:

Mysql : 

docker run -d \
  --name redash-mysql-1 \
  -e MYSQL_ROOT_PASSWORD=redashpassword \
  -e MYSQL_DATABASE=JarvisAI \
  -e MYSQL_USER=redash \
  -e MYSQL_PASSWORD=redashpassword \
  -p 3307:3306 \
  mariadb:10.6


then check docker ps Your container should be up and running.

Use this if you are using mysql workbench:
docker exec -it redash-mysql-1 mysql -uroot -predashpassword -e "GRANT ALL PRIVILEGES ON JarvisAI.* TO 'redash'@'%'; FLUSH PRIVILEGES;"


MONGO Db 

Login to Mongo Db 

Go to your project 

Connect to your Cluster