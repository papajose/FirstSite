const express = require('express')
const mongodb = require('mongodb')

const router = express.Router();

//Get Posts
router.get('/', async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

//Add Post
router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date()
    });
    res.status(201).send('Created post: ' + req.body.text);
})

//Delete Post
router.delete('/:id', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({
        _id: new mongodb.ObjectID(req.params.id)
    });
    res.status(200).send('Deleted post: ' + req.params.id)
})

//Delete List
router.delete('/', async (req, res) => {
    const posts = await loadPostsCollection();
    for (id_key in req.body.ids) {
        if(req.body.ids.hasOwnProperty(id_key)) {
            var id = req.body.ids[id_key];
            await posts.deleteOne({
                _id: new mongodb.ObjectID(id)
            });
        }
    }

    res.status(200).send('Deleted posts: ' + req.body.ids)
})


async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect(
        'mongodb+srv://admin:Yxaz92moDs@fscluster.zvb1a.mongodb.net/FSDatabase?retryWrites=true&w=majority',
        {
            useNewUrlParser: true
        });

    return client.db('FSDatabase').collection('FSCollection');
}

module.exports = router;