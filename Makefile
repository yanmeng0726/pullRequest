up:
	docker-compose up -d

down: 
	docker-compose down

push:
	docker image tag pullrequest-api myan001/pullrequest
	docker push
