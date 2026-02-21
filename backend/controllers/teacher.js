const Teacher = require("../models/Teacher.Model");

exports.createTeacher = async(req,res) =>{
    try{
        const {name , subject , designation , bio , image } = req.body;
        if (!name || !subject || !designation || !bio || !image ){
            return res.status(400).json({status:"N",error: " All fields are required."})
        }
        const newTeacher = new Teacher({
            name , subject , designation , bio , image  
        });
        await newTeacher.save();
        return res.status(201).json({status:"Y",message:"Teacher Created Succesfully."});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
};

exports.getTeacher = async(req,res) => {
    try{
        const teachers = await Teacher.find();
        if(!teachers|| teachers.length === 0){
            return res.status(400).json({status: "Y", message : " NO DATA FOUND"});
        }
        return res.status(200).json({status:"Y",message:"Success",data: teachers});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};



exports.deleteTeacher = async(req,res) => {
    let id = req.params.id;
    try{
        const teacher = await Teacher.findByIdAndDelete(id)
        if (!teacher){
            return res.status(400).json({status:"Y",message : "NO Notice FOUND."})
        }
        return res.status(200).json({status:"Y",message:"Teacher Deleted Successfully."});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};


exports.updateTeacher = async(req,res) => {
    let id = req.params.id;
    try{
        const {name , subject , designation , bio , image } = req.body;
        if (!name || !subject || !designation || !bio || !image  ){
            return res.status(400).json({status:"N",error: " All fields are required."})
        }
        const teacher = await Teacher.findById(id)
        if (!teacher){
            return res.status(400).json({status:"Y",message : "NO Teacher FOUND."})
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(id,{name , subject , designation , bio , image });
        if (updatedTeacher){
        return res.status(201).json({status:"Y",message:"Teacher Updated Successfully."});
        }
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};