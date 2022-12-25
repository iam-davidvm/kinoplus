const express = require('express');
const router = express.Router();
const TempCinema = require('../models/tempCinema');
const Cinema = require('../models/cinema');
const User = require('../models/user');
const adminController = require('../controllers/admin');
const catchAsync = require('../utils/catchAsync');
const { validateCinema, isLoggedIn, isAdmin } = require('../utils/middleware');

router.get('/', isLoggedIn, isAdmin, adminController.renderAdminPage);

router.get(
  '/users',
  isLoggedIn,
  isAdmin,
  catchAsync(adminController.renderUsersOverview)
);

router
  .route('/users/:id')
  .get(isLoggedIn, isAdmin, catchAsync(adminController.renderUserRoles))
  .patch(isLoggedIn, isAdmin, catchAsync(adminController.editUserRoles))
  .delete(isLoggedIn, isAdmin, catchAsync(adminController.deleteUser));

router.get(
  '/users/:id/delete',
  isLoggedIn,
  isAdmin,
  catchAsync(adminController.flashDeleteUser)
);

router.get(
  '/requests',
  isLoggedIn,
  isAdmin,
  catchAsync(adminController.renderRequestsOverview)
);

router
  .route('/requests/:id')
  .get(isLoggedIn, isAdmin, catchAsync(adminController.renderRequest))
  .post(
    isLoggedIn,
    isAdmin,
    validateCinema,
    catchAsync(adminController.approveRequest)
  )
  .delete(isLoggedIn, isAdmin, catchAsync(adminController.deleteRequest));

router.get(
  '/requests/:id/delete',
  isLoggedIn,
  isAdmin,
  catchAsync(adminController.flashDeleteRequest)
);

module.exports = router;
