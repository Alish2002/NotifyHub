const mongoose = require("mongoose");

const uri = "mongodb+srv://notificationSystemUser:MySecurePass123@cluster0.nuhz4.mongodb.net/notifications?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Successfully connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));


  

  localStorage.setItem("accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMiIsInVzZXJuYW1lIjoiU2ltcmFuIiwiaWF0IjoxNzQ0MjYzMzM2LCJleHAiOjE3NDQyNjY5MzZ9.vKXa7G2egNZNd4EtRxx77Zh192r3ZHF2dCy_SprHx-0");