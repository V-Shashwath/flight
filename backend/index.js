const express = require("express");
const mongoose = require("mongoose");
const cors = require ('cors');

const app = express();

app.use(cors());

const mongoDB = "mongodb://127.0.0.1:27017/MyDB";
mongoose.connect(mongoDB).then((data)=>{
    console.log("MongoDB was connected successfully");
}).catch((err)=>{
    console.log("MongoDb connection error - ",err);
})

const PORT = 8001;
app.listen(PORT, () =>{
    console.log(`Server is running at port : ${PORT}`);
})



// schema -> model
const Schema = mongoose.Schema;
const FlightsSchema = new Schema ({
    "id": Number,
    "airline": String,
    "source": String,
    "destination": String,
    "fare": Number,
    "duration": String
})

const FlightsTable = mongoose.model("flights", FlightsSchema);

//Get all the flights..
app.get("/getAllFlights", function (req, res) {
    FlightsTable.find().then( (data) => {
        //console.log(data);
        res.status(200).json(data);
    }) 
    .catch((err) => {
        console.error("Error fetching flights:", err);
        res.status(400).json({ error: "Failed to retrieve flights data" });
    });
});

// For inserting a record in the table.
app.use(express.json());
app.post("/insertFlight", async function (req,res) {
    const id = req.body.id;
    const airline = req.body.airline;
    const source = req.body.source;
    const destination = req.body.destination;
    const fare = req.body.fare;
    const duration = req.body.duration;

    var flightsObj = new FlightsTable ({
        "id": id,
        "airline": airline,
        "source": source,
        "destination": destination,
        "fare": fare,
        "duration": duration
    })

    try {
        // Save the flight data using async/await
        const result = await flightsObj.save(); 
        res.status(201).json({ 
            message: "Record inserted successfully", 
            data: result
        });
    } 
    catch (err) {
        res.status(500).json({ 
            error: "Error inserting record"
        });
    }
});

// Update a flight record by ID
app.put("/updateFlight/:id", async (req, res) => {
    const { id } = req.params; 
    const { airline, source, destination, fare, duration } = req.body;

    try {
        const updateFlight = await FlightsTable.updateOne(
            { id: id }, 
            { airline, source, destination, fare, duration }
        );

        if (!updateFlight) {
            return res.status(404).json({ 
                error: "Flight not found" 
            });
        }

        res.status(200).json({
            message: "Flight updated successfully",
            data: updateFlight
        });
    } 
    catch (err) {
        res.status(500).json({ 
            error: "Error updating flight"
        });
    }
});


// Delete a flight record by ID
app.delete("/deleteFlight/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedFlight = await FlightsTable.findOneAndDelete({ id });

        if (!deletedFlight) {
            return res.status(404).json({ 
                error: "Flight not found" 
            });
        }

        res.status(200).json({
            message: "Flight deleted successfully",
            data: deletedFlight,
        });
    } 
    catch (err) {
        res.status(500).json({ 
            error: "Error deleting flight"
        });
    }
});

