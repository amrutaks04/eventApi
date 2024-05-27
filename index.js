const mongoose = require('mongoose');
const express = require('express');
const Event = require('./schema.js');
const Eventdes = require('./schemaEvent.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

async function connectToDb() {
  try {
    await mongoose.connect('mongodb+srv://amruta:vieFC9VXxVSgoPzM@cluster0.rgbuaxs.mongodb.net/EventManagement?retryWrites=true&w=majority&appName=Cluster0');
    console.log('DB Connection established');
    const port = process.env.PORT || 8002;
    app.listen(port, function() {
        console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    console.log("Couldn't establish connection");
  }
}

connectToDb();

app.post('/add-event', async function (request, response) {
    try {
        const newEvent = await Event.create({
            title: request.body.title,
            category: request.body.category,
            date: request.body.date,
            imageUrl: request.body.imageUrl
        });
        response.status(201).json({
            status: 'success',
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (error) {
        console.error('Error creating event:', error);
        response.status(500).json({
            status: 'failure',
            message: 'Failed to create event',
            error: error.message
        });
    }
});

app.get('/req-event', async function (request, response) {
    try {
        const { category } = request.query;
        const query = category ? { category } : {}; // Adjust query based on the presence of category
        const events = await Event.find(query);
        response.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        response.status(500).json({
            status: 'failure',
            message: 'Failed to fetch events',
            error: error.message
        });
    }
});

app.post('/add-eventdes', async function (request, response) {
    try {
        const newEventDes = await Eventdes.create({
            title: request.body.title,
            category: request.body.category,
            date: request.body.date,
            imageUrl: request.body.imageUrl,
            about: request.body.about,
            termsAndConditions: request.body.termsAndConditions,
            mode: request.body.mode,
            time: request.body.time,
            location: request.body.location
        });
        response.status(201).json({
            status: 'success',
            message: 'Event Description added successfully',
            event: newEventDes
        });
    } catch (error) {
        console.error('Error creating event description:', error);
        response.status(500).json({
            status: 'failure',
            message: 'Failed to create event description',
            error: error.message
        });
    }
});
app.get('/eventdes/:id', async function (request, response) {
    try {
        const id = request.params.id.trim(); // Trim the ID to remove any extra whitespace or newline characters
        const event = await Eventdes.findById(id);
        if (!event) {
            return response.status(404).json({
                status: 'failure',
                message: 'Event not found'
            });
        }
        response.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        response.status(500).json({
            status: 'failure',
            message: 'Failed to fetch event',
            error: error.message
        });
    }
});


module.exports = app;
