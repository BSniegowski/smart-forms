# smart-forms

Flexible and scalable form for CRUD operations on a database.

For local setup run in the root directory
```
docker-compose build
docker-compose up
```
then head to `localhost:5173` and if that does not work check the ID of frontend container by running `docker ps` and to get IP address run
```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <CONTAINER_ID>
```
substituting `<CONTAINER_ID>` with obtained ID and head to 
```
<IP_ADDRESS_OF_FRONTEND_CONTAINER>:5173
```