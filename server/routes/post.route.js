const express = require('express');
const router = express.Router();
const postModel = require('../models/post.model');
const jwtUtils = require('../utils/jwt.utils');

// Get all posts
router.get('/getall', async (req, res) => {
    try {
        const posts = await postModel.getAllPosts();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new post
router.post('/create', jwtUtils.authenticate, async (req, res) => {
    try {
        const { title, postText } = req.body;
        const userId = req.user.id;
        const postId = await postModel.createPost(userId, title, postText);
        res.status(201).json({ message: 'Post created successfully', postId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a post by ID
router.get('/getpost/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const post = await postModel.getPostById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a post
router.put('/update/:id', jwtUtils.authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        const { title, postText } = req.body;
        const userId = req.user.id;
        const post = await postModel.getPostById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to update this post' });
        }
        await postModel.updatePost(id, title, postText);
        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a post
router.delete('/delete/:id', jwtUtils.authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;
        const post = await postModel.getPostById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        if (post.user_id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this post' });
        }
        await postModel.deletePost(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;