# emed3repo

A (very) basic service to receive eMED3 documents

Mostly a rework of this: https://github.com/chrisckchang/mean-contactlist

Provides a web front end to add, view and edit entries and a RESTful API to do the same.

The endpoints are:

**/documents**

| Method  | Description |
| ------------- | ------------- |
| GET  | Find all documents |
| POST | Create a new document  |

**/documents/:id**

| Method  | Description |
| ------------- | ------------- |
| GET  | Find a single document by ID |
| PUT | Update entire document document |
| DELETE | Delete a document by ID  |
