const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/youtubeRegistration",{
  // useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   // useFindAndModify:false
  })
  .then(() => console.log("Connection successful..."))
  .catch((err) => console.error(err));
