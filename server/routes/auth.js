
const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const UserSchema = require('../models/User');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing from environment variables.');
}


// ==========================================
// JWT AUTHENTICATION MIDDLEWARE
// ==========================================

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Authentication token is required.'
        });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired authentication token.'
        });
    }
};


// ==========================================
// VALIDATION ERROR HANDLER
// ==========================================

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    next();
};


// ==========================================
// ROUTE 1: REGISTER NEW PATIENT
// POST /api/auth/register
// ==========================================

router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.'),

        body('name')
            .trim()
            .isLength({ min: 4 })
            .withMessage('Name should be at least 4 characters.'),

        body('password')
            .isLength({ min: 8 })
            .withMessage('Password should be at least 8 characters.'),

        body('phone')
            .matches(/^\d{10}$/)
            .withMessage('Phone number must be exactly 10 digits.')
    ],
    checkValidation,
    async (req, res) => {
        try {
            const email = req.body.email.trim().toLowerCase();

            const existingUser = await UserSchema.findOne({ email });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: 'A user with this email already exists.'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(
                req.body.password,
                salt
            );

            const newUser = await UserSchema.create({
                email,
                name: req.body.name.trim(),
                password: hashedPassword,
                phone: req.body.phone
            });

            const payload = {
                user: {
                    id: newUser.id
                }
            };

            const authtoken = jwt.sign(
                payload,
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(201).json({
                success: true,
                message: 'Registration successful.',
                authtoken
            });

        } catch (error) {
            console.error('Registration error:', error);

            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    error: 'Email already registered.'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Unable to register user.'
            });
        }
    }
);


// ==========================================
// ROUTE 2: LOGIN PATIENT
// POST /api/auth/login
// ==========================================

router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address.'),

        body('password')
            .notEmpty()
            .withMessage('Password is required.')
    ],
    checkValidation,
    async (req, res) => {
        try {
            const email = req.body.email.trim().toLowerCase();

            const theUser = await UserSchema.findOne({ email });

            if (!theUser) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials.'
                });
            }

            const checkHash = await bcrypt.compare(
                req.body.password,
                theUser.password
            );

            if (!checkHash) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials.'
                });
            }

            const payload = {
                user: {
                    id: theUser.id
                }
            };

            const authtoken = jwt.sign(
                payload,
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                success: true,
                message: 'Login successful.',
                authtoken
            });

        } catch (error) {
            console.error('Login error:', error);

            return res.status(500).json({
                success: false,
                error: 'Unable to login.'
            });
        }
    }
);


// ==========================================
// ROUTE 3: GET LOGGED-IN PATIENT PROFILE
// GET /api/auth/user
// ==========================================

router.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await UserSchema.findById(req.user.id)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found.'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Profile retrieval error:', error);

        return res.status(500).json({
            success: false,
            error: 'Unable to retrieve profile.'
        });
    }
});


// ==========================================
// ROUTE 4: UPDATE PATIENT PROFILE
// PUT /api/auth/user
// ==========================================

router.put(
    '/user',
    verifyToken,
    [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 4 })
            .withMessage('Name should be at least 4 characters.'),

        body('phone')
            .optional()
            .matches(/^\d{10}$/)
            .withMessage('Phone number must be exactly 10 digits.'),

        body('bloodGroup')
            .optional({ values: 'falsy' })
            .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
            .withMessage('Invalid blood group.'),

        body('sex')
            .optional({ values: 'falsy' })
            .isIn(['Male', 'Female', 'Other'])
            .withMessage('Invalid sex.'),

        body('dob')
            .optional({ values: 'falsy' })
            .isISO8601()
            .withMessage('Invalid date of birth.'),

        body('height')
            .optional({ values: 'falsy' })
            .isFloat({ min: 30, max: 250 })
            .withMessage('Height must be between 30 and 250 cm.'),

        body('weight')
            .optional({ values: 'falsy' })
            .isFloat({ min: 1, max: 500 })
            .withMessage('Weight must be between 1 and 500 kg.'),

        body('emergencyContact')
            .optional({ values: 'falsy' })
            .matches(/^\d{10}$/)
            .withMessage('Emergency contact must be exactly 10 digits.'),

        body('address')
            .optional({ values: 'falsy' })
            .isString()
            .isLength({ max: 500 })
            .withMessage('Address cannot exceed 500 characters.')
    ],
    checkValidation,
    async (req, res) => {
        try {
            const allowedFields = [
                'name',
                'phone',
                'bloodGroup',
                'sex',
                'dob',
                'height',
                'weight',
                'emergencyContact',
                'address'
            ];

            const updateData = {};

            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) {
                    updateData[field] =
                        typeof req.body[field] === 'string'
                            ? req.body[field].trim()
                            : req.body[field];
                }
            });

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'No profile information provided.'
                });
            }

            const updatedUser = await UserSchema.findByIdAndUpdate(
                req.user.id,
                { $set: updateData },
                {
                    new: true,
                    runValidators: true
                }
            ).select('-password');

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found.'
                });
            }

            console.log('Profile saved for user:', updatedUser._id);

            console.log('Saved patient details:', {
                bloodGroup: updatedUser.bloodGroup,
                sex: updatedUser.sex,
                dob: updatedUser.dob,
                height: updatedUser.height,
                weight: updatedUser.weight,
                emergencyContact: updatedUser.emergencyContact,
                address: updatedUser.address
            });

            return res.status(200).json({
                success: true,
                message: 'Profile updated successfully.',
                user: updatedUser
            });

        } catch (error) {
            console.error('Profile update error:', error);

            return res.status(500).json({
                success: false,
                error: 'Unable to update profile.'
            });
        }
    }
);


module.exports = router;
