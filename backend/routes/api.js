const router = require('express').Router();
const indexRouter = require('./index');
const usersRouter = require('./users');
const familyRouter = require('./family');
const geneticsRouter = require('./genetics');
const emailRouter = require('./email-link');
const userDataRouter = require('./userData')
const userChangedRouter = require('./usersChanged')

const jwt = require('jsonwebtoken')


router.get('/', (req, res) => {
    res.send("APIs working");
});


// mid
router.use((req, res, next) => {
    try {
        if (req.path === '/login' || '/form'){
            next();
        }else{
            const token = req.signedCookies['user-token'];
            const result = jwt.verify(token, process.env.LOGIN_SECRET);
            if (result) {
                // add role in req.userData
                next();
            }
            else res.status(401).send('Invalid login');
        }
        
        

    } catch (err) {
        return res.sendStatus(401);
    }
});
router.use('/', indexRouter);

router.use('/users', usersRouter);
router.use('/family', familyRouter);
router.use('/genetics', geneticsRouter);
router.use('/email', emailRouter);
router.use('/admin/userData', userDataRouter);
router.use('/admin/usersChanged', userChangedRouter)

module.exports = router;