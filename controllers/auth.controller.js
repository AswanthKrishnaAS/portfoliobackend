const User = require('../models/user.model');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Send a simple token back
        const mockToken = `token_${user._id}_${Date.now()}`;

        res.json({
            message: 'Login successful',
            token: mockToken,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { login };
