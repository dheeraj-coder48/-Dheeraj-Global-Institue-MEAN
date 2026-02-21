const mongoose = require ("mongoose");

const teacherSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true,
    },
    subject:{
        type:String,
        required : true,
    },
    designation:{
        type:String,
        required : true,
    },
    bio:{
        type:String,
        required : true,
    },
    image:{
        type:String,
        required : true,
    },
},{
 timestamps: true 
}
);

const Teacher = mongoose.model("Teacher", teacherSchema) 
module.exports = Teacher;
