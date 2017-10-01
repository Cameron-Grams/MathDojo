const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const {  } = require('../models');
const { app, runServer, closeServer } = require('../app');
const { TEST_DATABASE_URL } = require('../config');

chai.use( chaiHttp );
 
