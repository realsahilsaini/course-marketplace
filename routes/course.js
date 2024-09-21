const {Router} = require('express');
const courseRouter = Router();


//See course route
courseRouter.get('/courses', (req, res) => {
  res.send("Courses");
});

//Purchase course route
courseRouter.get('/my-purchases', (req, res) => {
  res.send("My Purchases");
});

//Puchase a course route
courseRouter.post('/purchase', (req, res) => {
  res.send("Purchasing a course");
});

module.exports = {
  courseRouter: courseRouter
}