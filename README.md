
This project is built on top of a screenshot diffing tool [VisualReview](https://github.com/xebia/VisualReview) and [cypress](https://www.cypress.io/)

It integrates Cypress with visual review screenshot comparison tool and gives user possibility to review the UX designs by accessing visual review server. 

* To Use : 

- `docker run -p 7000:7000 chit786/cypress-vr-screendiff:0.2` : This will start visual review server at [http://localhost:7000/](http://localhost:7000)
- execute tests using `npm run cypress:run` which will takescreenshots and send it to visual review server



 
 

  
