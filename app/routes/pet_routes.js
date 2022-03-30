//import our dependencies,middleware and models
const express = require('express')
const passport = require('passport')

//pull in our model
const Pet = require('../models/pet')

//helps us detect certain situations and send custom errors
const customErrors = require('../../lib/custom_errors')

//this function sends a 404 when non-existentdocument is requested 
const handle404 = customErrors.handle404

//middleware that can send a 401 when a user tries to access something they do not own
const requireOwnership = customErrors.requireOwnership

//requireToken is passed as a second arg to router.<verb> 
//makes it so a token Must be passed for that route to be available->also sets 'req.user'
const requireToken = passport.authenticate('bearer', {session:false})

//this middleware removes any blanks from req.body
const removeBlanks = require('../../lib/remove_blank_fields')

//instantiate our router
const router=express.Router()

//ROUTES GO HERE

//INDEX
//GET /pets
router.get('/pets', (req, res, next) => {
    //we will allow access to view all pets, by skipping 'requureToken'
    //if we wanted to make this a protected resource, ew'd just need to add 
    //that middleware as our 2nd arg to our GET like we did in our CREATE route below
    Pet.find()
        .populate('owner')
        .then(pets=> {
            //pets will be an array of mongoose documents
            //so we want to turn them into POJO(plain old js objects)
            //remember that map returns a new array
            return pets.map(pet=>pet.toObject())
        })
        .then(pets=> res.status(200).json({pets:pets}))
        .catch(next)
})

//SHOW
//GET /pets/624470c43a3c6b0b53031a26
router.get('/pets/:id', (req,res,next) => {
    //we'll get the id from the req.params.d -> :id
    Pet.findById(req.params.id)
        .then(handle404)
        //if successful, respond with an object as json
        .then(pet => res.status(200).json( {pet:pet.toObject() }))
        //otherwise, pass to error handler
        .catch(next)
})

//CREATE
//POST /pets
router.post('/pets', requireToken,(req, res, next) => {
    //we brought in requireToken so we can have access to req.user
    req.body.pet.owner = req.user.id
    Pet.create(req.body.pet)
        .then(pet => {
            //send a successful response like this
            res.status(201).json({pet:pet.toObject() })
        })
        //if error occurs, pass it to error handler
        .catch(next)
})
//UPDATE
//REMOVE

//ROUTES ABOVE HERE

//keep at bottom of file
module.exports = router