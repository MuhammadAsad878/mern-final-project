class ExpressError extends Error{
    constructor(status,message){
      super();
      this.status = status;
      this.message = message;
    }
}

function wrapAsync(fn){
  return function(req,res,next){
    fn(req,res,next).catch((err) => next(err));
  }
}

export {ExpressError, wrapAsync};

// try{
//   fn(req,res,next);
// }catch(err){
//   next(err);
// }