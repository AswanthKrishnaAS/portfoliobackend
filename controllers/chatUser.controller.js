const ChatUser = require('../models/chatUser.model');

exports.createChatUser = async (req, res) => {
    try {
        const { name, gender } = req.body;
        
        if (!name || !gender) {
            return res.status(400).json({ message: 'Name and gender are required' });
        }

        const newUser = new ChatUser({
            name,
            gender
        });

        await newUser.save();
        
        res.status(201).json({ 
            success: true, 
            message: 'Chat user session initiated successfully',
            data: newUser 
        });
    } catch (error) {
        console.error('Error in createChatUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getChatUsers = async (req, res) => {
    try {
        const users = await ChatUser.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat users' });
    }
};
