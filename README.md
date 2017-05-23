# Angular-SailsJs-SocketIo

#### For Working with Angular 
```
	cd web
	npm install
	ng s -o
```
Angular is using the latest that is out right now. The socket service is listed as RdService and is only being used in the UserComponent right now for demoing and testing.

#### For Working with SailsJs Rest Api
```
	cd api
	npm install
	sails lift
```
Sails is currently just using memory for the database, because I was making this to see if I could. There is only one model, users, that is setup to work with the sockets. That being said there is very little that needs to be added to a model to make it work with the current setup.
