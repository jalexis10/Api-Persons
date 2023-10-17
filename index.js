const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const debug = require('debug')('app');
const morgan = require('morgan');
const fs = require('fs');
const moment = require('moment');

const port = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'app';
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/persons', (req, res) => {
    let accessData = require('./src/access.json');
    
    if (!accessData.hasOwnProperty('access_list') || !Array.isArray(accessData.access_list)) {
        accessData.access_list = [];
    }

    const currentDate = moment().format('YYYY/MM/DD HH:mm');
    accessData.access_list.push(currentDate);

    fs.writeFile('./src/access.json', JSON.stringify(accessData), (err) => {
        if (err) {
            debug(err);
        }
    });

    const persons = require('./src/persons.json');
  
    const filteredPersons = persons.filter(person => {
      const ageInDays = (person.age*365);
      console.log(ageInDays);
      return ageInDays > 5475;
    });
  
    res.render('persona', { persons: filteredPersons });
  });
  



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});