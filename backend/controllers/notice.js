const Notice = require("../models/Notice.Model");

exports.createNotice = async(req,res) =>{
    try{
        const {title , description , date , category } = req.body;
        if (!title  || !description || !date || !category ){
            return res.status(400).json({status:"N",error: " All fields are required."})
        }
        const newNotice = new Notice({
            title , description , date , category 
        });
        await newNotice.save();
        return res.status(201).json({status:"Y",message:"Notice Created Succesfully."});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
};

exports.getNotice = async(req,res) => {
    try{
        const notices = await Notice.find();
        if(!notices|| notices.length === 0){
            return res.status(400).json({status: "Y", message : " NO DATA FOUND"});
        }
        return res.status(200).json({status:"Y",message:"Success",data: notices});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};



exports.deleteNotice = async(req,res) => {
    let id = req.params.id;
    try{
        const notice = await Notice.findByIdAndDelete(id)
        if (!notice){
            return res.status(400).json({status:"Y",message : "NO Notice FOUND."})
        }
        return res.status(200).json({status:"Y",message:"Notice Deleted Successfully."});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};


exports.updateNotice = async(req,res) => {
    let id = req.params.id;
    try{
        const {title , description , date , category} = req.body;
        if (!title  || !description || !date || !category ){
            return res.status(400).json({status:"N",error: " All fields are required."})
        }
        const notice = await Notice.findById(id)
        if (!notice){
            return res.status(400).json({status:"Y",message : "NO Notice FOUND."})
        }

        const updatedNotice = await Notice.findByIdAndUpdate(id,{title , description , date , category});
        if (updatedNotice){
        return res.status(201).json({status:"Y",message:"Notice Updated Successfully."});
        }
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};