const express = require('express');
const router = express.Router();

const  { create , brandById , read ,update , remove , list } = require ('../controllers/brand');
const  {requireSignin , isAuth, isAdmin } = require ('../controllers/auth');
const  { userById } = require ('../controllers/user');


router.get('/brand/:brandId', read);
router.post('/brand/create/:userId',requireSignin, isAuth, isAdmin , create);
router.put('/brand/:brandId/:userId',requireSignin, isAuth, isAdmin , update );
router.delete('/brand/:brandId/:userId',requireSignin, isAuth, isAdmin , remove);
router.get('/brands', list);


router.param('brandId',brandById);
router.param('userId',userById);

module.exports = router;