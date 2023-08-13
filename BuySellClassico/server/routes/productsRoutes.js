const router = require("express").Router();
const User = require("../models/userModel");
const Product = require("../models/productModel");
const authMiddleware = require("../middleware/authMiddleware");
const cloudinaryConfig = require("../config/cloudinaryConfig");
const multer = require("multer");
const productModel = require("../models/productModel");
const Notification  = require("../models/notificationModel");
const Bid = require("../models/BidModel");

// adding a new product..
router.post("/add-product", authMiddleware, async (req, res) => {
    try {
        const newProduct = await Product(req.body);
        await newProduct.save();
        
        //send notifications to admins..
        const admin= await User.findOne({role:"admin"});
        const seller = await User.findOne({_id:newProduct.seller});
          const newNotification = new Notification({
            user:admin._id,
            message:`New product added by ${seller.name}`,
            title:"New Product",
            onClick:`/admin`,
            read:false,
        })
          await newNotification.save();
        res.send({
            success: true,
            message: "Product added successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
});

// get all productss..
router.post("/get-products", async (req, res) => {
    try {
        const { seller, category = [], age = [],status,search="",sold} = req.body;
        let filters = {};
        if (seller) {
            filters.seller = seller;
        }
        if(status){
            filters.status = status;
        }
        // filter by category..
        if(category.length>0){
            filters.category={ $in : category };
        }
        if(sold===false){
                   filters.sold =sold
        }

        // filter by age..
        if(age.length>0){
            age.forEach((item) => {
                const fromAge = item.split("-")[0];
                const toAge = item.split("-")[1];
                filters.age = {$gte:fromAge,$lte:toAge};
            });
        }

        if (search.trim() !== "") {
            filters.name = { $regex: search, $options: "i" };
          }
        const products = await Product.find(filters).populate('seller').sort({ createdAt: -1 });
        res.send({
            success: true,
            data: products
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
});
// edit product..
router.put("/edit-product/:id", authMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.send({
            success: true,
            message: "Product updated successfully"
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
});
// update product sold status
router.put("/update-product-sold/:id", authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(productId, { sold: true });
    
    if (!product) {
      res.send({
        success: false,
        message: "Product not found"
      });
    }

    res.send({
      success: true,
      message: "Product sold status updated successfully"
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    });
  }
});


// get product by id..
router.get("/get-product-by-id/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller");
        res.send({
            success: true,
            data: product
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })

    }
})
// delete product...
router.delete("/delete-product/:id", authMiddleware, async (req, res) => {
    try {
        const productId = req.params.id;
       const product =    await Product.findByIdAndDelete(productId);
        if(!product){
            res.send({
                success:false,
                message:"Product not found"
            });
        }
        // delete related bids 
         await Bid.deleteMany({product:productId});

         await Product.findByIdAndDelete(productId);
        res.send({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

//get image from pc
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});


//
router.post("/upload-product-image", authMiddleware, multer({ storage: storage }).single('file'), async (req, res) => {
    try {
        // upload image to cloudinary
        const result = await cloudinaryConfig.uploader.upload(req.file.path, {
            folder: "ecommerce"
        });
        const productId = req.body.productId;
        await Product.findByIdAndUpdate(productId,
            { $push: { images: result.secure_url } });
        res.send({
            success: true,
            message: "Image uploaded successfully",
            data: result.secure_url
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
});

// update product status...
router.put("/update-product-status/:id", authMiddleware, async (req, res) => {
    try {
        const { status, } = req.body;
    const updatedProduct =     await Product.findByIdAndUpdate(req.params.id, { status });

        // send notificatin to seller product status updated.
        const newNotification = new Notification({
            user:updatedProduct.seller,
            message:`Your product ${updatedProduct.name} has been ${status}`,
            title:"Product Status updated",
           onClick:`/profile`,
            read:false,
          });
          await newNotification.save();
        res.send({
            success: true,
            message: "Product status udpated successfully"
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});


module.exports = router;