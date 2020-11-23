const express = require('express');
const router = express.Router();

const  { create , hairById , read ,update , remove , list } = require ('../controllers/hair');
const  {requireSignin , isAuth, isAdmin } = require ('../controllers/auth');
const  { userById } = require ('../controllers/user');


router.get('/hair/:hairId', read);
router.post('/hair/create/:userId',requireSignin, isAuth, isAdmin , create);
router.put('/hair/:hairId/:userId',requireSignin, isAuth, isAdmin , update );
router.delete('/hair/:hairId/:userId',requireSignin, isAuth, isAdmin , remove);
router.get('/hairs', list);


router.param('hairId',hairById);
router.param('userId',userById);

module.exports = router;