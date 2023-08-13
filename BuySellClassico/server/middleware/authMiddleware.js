const jwt = require("jsonwebtoken");

module.exports=(req,res,next)=>{
            try {
                const token = req.header("authorization").split(" ")[1];
                const decrpyToken = jwt.verify(token,process.env.jwt_secret);
                req.body.userId=decrpyToken.userId;
                next();
                
            } catch (error) {
                res.send({
                    success:false,
                    message:error.message,
                })
            }
}