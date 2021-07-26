const express = require('express');
const app = express();

const authController = require('../controllers/authController');
const locationController = require('./../controllers/locationController');

const router = express.Router();

router.route('/login').post(authController.login);
router.route('/logout').post(authController.logout);
router.route('/location-update').put(authController.authorizeAdmin, locationController.update);
router.route('/location-search').post(authController.authorizeUser, locationController.search);
router.route('/validate-token').post(authController.validateToken);

module.exports = router;