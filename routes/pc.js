const express = require('express');
const router = express.Router();

const  { create , pcById , read ,update , remove , list } = require ('../controllers/pc');
const  {requireSignin , isAuth, isAdmin } = require ('../controllers/auth');
const  { userById } = require ('../controllers/user');


router.get('/pc/:pcId', read);
router.post('/pc/create/:userId',requireSignin, isAuth, isAdmin , create);
router.put('/pc/:pcId/:userId',requireSignin, isAuth, isAdmin , update );
router.delete('/pc/:pcId/:userId',requireSignin, isAuth, isAdmin , remove);
router.get('/pcs', list);


router.param('pcId',pcById);
router.param('userId',userById);

module.exports = router;