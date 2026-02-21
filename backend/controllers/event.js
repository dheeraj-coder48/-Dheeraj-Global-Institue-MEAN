const Event = require("../models/Event.Models");

exports.createEvent = async(req,res) =>{
    try{
        const {title , description , shortDescription , date , location} = req.body;
        if (!title  || !description || !shortDescription || !date || !location){
            return res.status(400).json({status:"N",error: " All fields are required."})
        }
        const newEvent = new Event({
            title , description , shortDescription , date , location
        });
        await newEvent.save();
        return res.status(201).json({status:"Y",message:"Event Created Succesfully."});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
};

exports.getEvent = async(req,res) => {
    try{
        const events = await Event.find();
        if(!events || events.length === 0){
            return res.status(400).json({status: "Y", message : " NO DATA FOUND"});
        }
        return res.status(200).json({status:"Y",message:"Success",data:events});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};



exports.deleteEvent = async(req,res) => {
    let id = req.params.id;
    try{
        const events = await Event.findByIdAndDelete(id)
        if (!events){
            return res.status(400).json({status:"Y",message : "NO EVENT FOUND."})
        }
        return res.status(200).json({status:"Y",message:"Event Deleted Successfully."});
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};


exports.updateEvent = async(req,res) => {
    let id = req.params.id;
    try{
        const {title , description , shortDescription , date , location} = req.body;
        if (!title  || !description || !shortDescription || !date || !location){
            return res.status(400).json({status:"N",error: " All fields are required."})
        }
        const events = await Event.findById(id)
        if (!events){
            return res.status(400).json({status:"Y",message : "NO EVENT FOUND."})
        }

        const updatedEvent = await Event.findByIdAndUpdate(id,{title , description , shortDescription , date , location});
        if (updatedEvent){
        return res.status(200).json({status:"Y",message:"Event Updated Successfully."});
        }
    }catch(error){
        console.log(error);
        return res.status(500)
        .json({status:"N",error: `Internal Server Error : ${error}`});
    }
    
};