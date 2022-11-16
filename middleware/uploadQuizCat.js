var multer=require('multer');

var storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname)
    }
});
// console.log("upload:"+JSON.stringify(storage))
var upload=multer({
    storage:storage,
    // fileFilter:function(req,file,cb){
    //     // console.log("filter"+JSON.stringify(file))
    //     if( file.mimetype=="image/jpeg" || file.mimetype=="image/png")
    //     {
    //         cb(null, true)
    //     }
    //     else{
    //         console.log("only jpg & png file supported!")
    //         cb(new Error('not a vaild file'))
    //     }
    // },
    // limits:{
    //     fileSize:1024*1024*2
    // }
});
// console.log('after'+JSON.stringify(upload))

module.exports=upload
