const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination:function(req,file,cb){
cb(null,'./uploads/');
  }, filename: function (req,file,cb){
 cb(null, new Date().toISOString() + file.originalname); 
  }
})

const fileFilter = (req,file,cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
  cb(null,true);
} else {
  cb(null,false);
}
} 
const upload = multer({storage:storage, limits : {
  fileSize:1024 * 1024 * 5
}, fileFilter:fileFilter
});


// Load User model
const Business = require("../../models/Business");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/business",upload.single('businessImage'), (req, res) => {
 console.log(req.file)
  Business.findOne({ name: req.body.name }).then(business => {
    if (business) {
      return res.status(400).json({ name: "name already exists" });
    } else {
      
      const newBusiness = new Business({
        name: req.body.name,
        type:req.body.type,
        location: req.body.location,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        phone:req.body.phone,
        timings:req.body.timings,
        delivery:req.body.delivery,
        businessImage: req.file.path
      });
  newBusiness.save((err,success) => {
      if(err){
          return res.send(err);
      } 
      res.send(req.body);
  })
    
    }
  
  });
});

router.get("/business",async (req,res) => {
  try{
    var name=req.params.name;
    var names=await Business.find({
    });

    if(names.length>0){
      return res.send(names);
    } else {
      return res.send({message:"not found"});
    } 
  }
    catch (err){
      return res.send(err.message)
    }
  
})

router.patch('/update',upload.single('businessImage'), async(req, res) => {
    
    try{
        const updateBusiness = await Business.findOneAndUpdate({name: req.body.name},{
          
            $set: {
        
        name: req.body.newName,
        type:req.body.type,
        location: req.body.location,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        phone:req.body.phone,
        timings:req.body.timings,
        delivery:req.body.delivery,
        businessImage: req.file.path
            }
        },{new: true, useFindAndModify: false});
        res.json(updateBusiness)
       
    }
    catch(err){
        res.send(err)
    }
})
{/*router.patch('/update', upload.single('businessImage'), (req, res, next) => {
  Business.updateOne(req.params.name, { $set: req.body }, {new:true, useFindAndModify: false} , err => {
   
    if (err) {
      return next(err);
    }
    res.status(200).json(req.body);
  })
});*/}

router.post('/delete',(req,res) => {
 Business.deleteOne({name:req.body.name}).then(business => {
   if(business){
    return res.status(200).json({message: 'Business deleted successfully. Refreshing data...', success: true})
   } 
 });
});



module.exports = router;