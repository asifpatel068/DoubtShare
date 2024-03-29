const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const cors=require("cors")
const { connection } = require("./Config/db");
const { userRouter } = require("./Routes/userRouter");
const { doubtRouter } = require("./Routes/doubtRouter");
const {UserModel} = require('./Model/User.Model');
const Doubt = require('./Model/Doubt');
const TutorAvailability = require('./Model/TutorAvailability');


require('dotenv').config();

const port = process.env.PORT;
const app = express();
app.use(cors())
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server);



(async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
    console.log("Not Connected to DB");
  }
})();

app.get("/", (req, res) => {
  res.send("Welcome to DoubtShare Backend");
});

app.use("/user", userRouter);
app.use("/doubt", doubtRouter);


io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('ping', async ( userId ) => {
      try {
        
        const tutorAvailability = await TutorAvailability.findOne({
          tutorId: userId,
        });
  
        if (tutorAvailability) {
          tutorAvailability.lastPingTime = Date.now();
          await tutorAvailability.save();
        } else {
          await TutorAvailability.create({
            tutorId: userId,
            lastPingTime: Date.now(),
          });
        }
        updateAvailableTutorsCount();
      } catch (error) {
        console.error('Error updating tutor availability:', error);
      }
    });
  
  


    socket.on('doubtRequest', async (doubtData) => {
      try {
        
        const onlineTutorsAvailability = await TutorAvailability.find({
          tutorId: { $ne: doubtData.tutorId }, 
          lastPingTime: { $gt: Date.now() - 3000 },
        });
        
        const onlineTutorIds = onlineTutorsAvailability.map((tutorAvailability) => tutorAvailability.tutorId);

        const onlineTutors = await UserModel.find({
          _id: { $in: onlineTutorIds },
          userType: 'Tutor',
          language: doubtData.language,
          subject: doubtData.subject,
        });

        console.log(onlineTutorIds)
        onlineTutors.forEach((onlineTutor) => {
          io.to(onlineTutor.socketId).emit('notification', {
            studentId: doubtData.studentId,
            message: 'New doubt request. Do you want to help?',
          });
        });
      } catch (error) {
        console.error('Error fetching online tutors:', error);
      }
    });
    
  
   


  socket.on('tutorResponse', async (response) => {
    const currentTime = Date.now();
  
    if (response.accepted) {
      const studentSocketId = response.studentSocketId;
      const tutorSocketId = response.tutorSocketId;
  
      const chatRoomId = `${response.studentId}-${response.tutorId}`;
  
      io.to(studentSocketId).emit('startChat', {
        tutorId: response.tutorId,
        chatRoomId,
      });
      io.to(studentSocketId).emit('joinChatRoom', chatRoomId);
  
      io.to(tutorSocketId).emit('startChat', {
        studentId: response.studentId,
        chatRoomId,
      });
  
      io.to(tutorSocketId).emit('joinChatRoom', chatRoomId);
  
      try {
        const tutorAvailability = await TutorAvailability.findOne({
          tutorId: response.tutorId,
        });
  
        if (tutorAvailability) {
          tutorAvailability.lastPingTime = currentTime;
          await tutorAvailability.save();
        } else {
          await TutorAvailability.create({
            tutorId: response.tutorId,
            lastPingTime: currentTime,
          });
        }
      } catch (error) {
        console.error('Error updating tutor availability:', error);
      }
    }
  });
  
  

    socket.on('disconnect', async () => {
      console.log('User disconnected');
  
      
    });
  

  });
  
  async function updateAvailableTutorsCount() {
    const currentTime = Date.now();
  
    try {
      const availableTutorsCount = await TutorAvailability.countDocuments({
        lastPingTime: { $gt: currentTime - 3000 },
      });
  
      io.emit('availableTutorsCount', availableTutorsCount);
    } catch (error) {
      console.error('Error updating tutor availability:', error);
    }
  }
  // cron.schedule('*/3 * * * *', async () => {
  //   const currentTime = Date.now();
  
  //   try {
     
  //     await UserModel.updateMany(
  //       { lastPingTime: { $gt: currentTime - 3000 }, userType: 'Tutor' },
  //       { $set: { lastPingTime: currentTime } }
  //     );
  
     
  //     const availableTutorsCount = await UserModel.countDocuments({
  //       lastPingTime: { $gt: currentTime - 3000 },
  //       userType: 'Tutor',
  //     });
  
  //     io.emit('availableTutorsCount', availableTutorsCount);
  //   } catch (error) {
  //     console.error('Error updating tutor availability with CRON job:', error);
  //   }
  // });

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
});

server.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
