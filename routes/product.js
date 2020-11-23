const express = require('express');
const router = express.Router();

const  { create , 
    productById , 
    read , 
    update, 
    remove ,
    list ,
    listSearch,
    listRelated,
    writeReview,
    listRecommended,
     listCategories,
     listBrands,
     listHairs,
     listPcs,
     listBySearch,
     photo,
     comment
    } = require ('../controllers/product');
const  {requireSignin , isAuth, isAdmin } = require ('../controllers/auth');
const  { userById } = require ('../controllers/user');

router.post('/product/create/:userId',requireSignin, isAuth, isAdmin , create);
router.get('/product/:productId', read);
router.put('/product/:productId/:userId',requireSignin, isAuth, isAdmin , update );
router.delete('/product/:productId/:userId',requireSignin, isAuth, isAdmin , remove);
router.put('/product/comment', requireSignin, isAuth, isAdmin , comment);


router.get('/products',list);
router.get('/products/search',listSearch);
router.get('/products/related/:productId',listRelated);

router.get('/products/categories',listCategories);
router.get('/products/brands',listBrands);
router.get('/products/pcs',listPcs);
router.get('/products/hairs',listHairs);

//post bcoz we give some input
router.post('/products/by/search', listBySearch);
router.get('/product/photo/:productId', photo);


router.param('userId',userById);
router.param('productId',productById);
module.exports = router;