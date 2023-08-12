const db = require("../../models");
const { Op } = require("sequelize");

const isClockedIn = async (userID) => {
  const existingHistory = await db.History.findOne({
    where: { userID, ClockOut: null },
  });
  return existingHistory !== null;
};

const attendanceController = {
  clockIn: async (req, res) => {
    try {
      const { userID } = req.body;

      const userIsClockedIn = await isClockedIn(userID);
      if (userIsClockedIn) {
        return res.status(400).json({ message: "User is already clocked in" });
      }

      // Create a new history entry for clock in with ClockOut set to null
      await db.History.create({
        userID,
        ClockIn: new Date(),
        ClockOut: null,
      });

      res.status(200).json({ message: "Clock In Successful", userID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  clockOut: async (req, res) => {
    try {
      const { userID } = req.body;
    
      console.log("Clock out requested for userID:", userID);
    
      // Find the latest history entry for the user where ClockOut is null
      const history = await db.History.findOne({
        where: { userID, ClockOut: null },
        order: [["ClockIn", "DESC"]],
      });

      const salary = await db.User.findOne({
        where: { id: userID }, // Use id instead of userID
      });
    
      console.log("Retrieved history:", history);
    
      if (!history) {
        return res.status(400).json({ message: "User is not clocked in" });
      }
    
      // Update the clock out time and calculate HourlyRate
      history.ClockOut = new Date();
      const timeDiffMilliseconds = history.ClockOut - history.ClockIn;
      const hoursWorked = timeDiffMilliseconds / (1000 * 60 * 60);
      
      history.HourlyWorks = hoursWorked;
      history.DaySalary = salary.baseSalary * hoursWorked;
      await history.save();
      
      console.log("Hours Work:", hoursWorked);
      
      console.log("gaji per jam", history.DaySalary);
      
      res.status(200).json({ message: "Clock Out Successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  

  getHistoryByUserId: async (req, res) => {
    try {
      const { userID } = req.params;

      // Find history records for the given user ID
      const historyRecords = await db.History.findAll({
        where: { userID },
      });

      res.status(200).json({ message: "Success", history: historyRecords });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = attendanceController;
