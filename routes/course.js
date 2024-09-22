const {Router} = require('express');
const {CourseModel} = require('../db/db');
const courseRouter = Router();


//See all courses route
courseRouter.get('/', async (req, res) => {
  try{

    const courses = await CourseModel.find();
    res.json({courses});

  }catch(err){
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
});

//Specific course route
courseRouter.get('/:id', async (req, res) => {
  try{

    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({course});

  }catch(err){

    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: err.message  
    });
  }

});

//Search course by title route
courseRouter.get('/search/title', async (req, res) => {
  try{

    const title = (req.body.title);


    const course = await CourseModel.findOne({title});


    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json({course});

  }catch(err){
    res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
});

module.exports = {
  courseRouter: courseRouter
}