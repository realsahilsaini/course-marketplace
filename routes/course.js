const {Router} = require('express');
const courseRouter = Router();


//See all courses route
courseRouter.get('/all', (req, res) => {
  res.json({message: "All courses"});
});

//Specific course route
courseRouter.get('/:id', (req, res) => {
  res.json({message: "Single course"});
});

//Search course by title route
courseRouter.post('/search/:title', (req, res) => {
  res.json({message: "Search by title"});
});

module.exports = {
  courseRouter: courseRouter
}