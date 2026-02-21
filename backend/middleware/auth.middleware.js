// const jwt = require("jsonwebtoken")
// function authenicateJWT(req,res,next){
//     const authHeader = req.header("Authorization");
//     console.log(authHeader);
//     const token = authHeader && authHeader.split(" ")[1]
//     if(!token){
//         return res.status(401).json({error : "Access Denied,Token missing."});

//     }
//     try{
//         const decoded = jwt.verify(token,process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     }catch(error){
//         console.error("JWT VERIFICATION ERROR : ",error);
//         return res.status(400).json({error:"Invalid Token."})
//     }
//     next();
// };

// module.exports = authenicateJWT














const jwt = require("jsonwebtoken");

function authenicateJWT(req, res, next) {
    const authHeader = req.header("Authorization");
    console.log(authHeader);

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied, Token missing." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT VERIFICATION ERROR:", error);
        return res.status(400).json({ error: "Invalid Token." });
    }
}

module.exports = authenicateJWT;
