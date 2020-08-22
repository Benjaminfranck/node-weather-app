const path = require('path')
const express = require('express')
const app = express()
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath  = path.join(__dirname, '../public')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const port = process.env.PORT || 3000


app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(express.static(publicDirectoryPath))

app.get('', (req,res)=> {
    res.render('index' , {
        title: 'Weather App',
        name: "Benjamin Franck"
    })
})

app.get('/about', (req,res)=> {
    res.render('about' , {
        title: 'About',
        name: "Benjamin Franck"
    })
})

app.get('/help', (req,res)=> {
    res.render('help' , {
        helptext: 'this is some useful text',
        title: 'Help',
        name: 'Benjamin Franck'
    })
})


app.get('/weather', (req,res)=> {
    if(!req.query.address){
        return res.send({
            error: "You must provide a search term"
        })
    }
    {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
    
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({
                        error: error
                    })
                }
                console.log(location)
                console.log(forecastData)
                res.send({
                    forecast: forecastData,
                    location:  location,
                    address: req.query.address
                })
            })
        })
    }
})



app.get('/products', (req,res)=> {
    if(!req.query.search){
        return res.send({
            error: "You must provide a search term"
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.listen(port, () => {
    console.log('Server is up on port'+ port)
})

