const express = require('express');
const Post = require("../models/post");
var { ObjectID } = require("mongodb");
const _ = require("lodash");
const multer = require('multer');
const middleWareUser = require("../middleware/user-checker");

const { PagedResult } = require("../viewModels/pageresult");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const serverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        let error = "Invalid mimetype.";
        if (ext) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.get("", (req, resp) => {

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find({});

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    // var viewModel = {
    //     message: "",
    //     posts: []
    // };

    var pageResult = new PagedResult(currentPage, pageSize);

    postQuery.then(result => {
        //viewModel.posts = result;
        pageResult.resultsArray = result;
        return Post.count();
    }).then((count) => {

        pageResult.count = count;

        resp.status(200).json({ pagedResult: pageResult });
    });
});

router.get("/:id", (req, resp) => {

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).send();
    }

    Post.findOne({ _id: req.params.id }).then((post) => {
        resp.status(200).send(post);
    }).catch((error) => {
        resp.status(200).send({ error });
    });

});

router.post("", middleWareUser, multer({ storage: serverStorage }).single("image"), (req, resp) => {

    const url = req.protocol + '://' + req.get('host');

    var obj = _.pick(req.body, ["title", "content"]);

    obj['imagePath'] = url + '/images/' + req.file.filename;
    obj['creator'] = req.utenteloggato.id;

    const post = new Post(obj);

    post.save()
        .then(result => {
            resp.status(200).send({ id: result._id, title: result.title, content: result.content, imagePath: result.imagePath });
        })
        .catch(error => {
            console.log(error);
        });

    resp.status(201);
});

router.put('/:id', middleWareUser, multer({ storage: serverStorage }).single("image"), async (req, resp) => {

    let imageP = req.body.imagePath;

    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imageP = url + "/images/" + req.file.filename;
    }

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).send();
    }

    var obj = _.pick(req.body, ["title", "content"]);

    try {
        const postAggiornato = await Post.findOneAndUpdate({ _id: req.params.id, creator: req.utenteloggato.id }, obj);

        console.log(postAggiornato);

        if (typeof postAggiornato != 'undefined' && postAggiornato) {
            resp.status(200).send(postAggiornato);
        }
        else {
            resp.status(401);
        }
    } catch (error) {
        resp.status(400).send();
    }
});

router.delete("/:id", middleWareUser, async (req, resp) => {

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).send();
    }

    try {
        const postEliminato = await Post.deleteOne({ _id: req.params.id, creator: req.utenteloggato.id });

        //const postEliminato = await Post.findByIdAndRemove(req.params.id);

        if (typeof postAggiornato != 'undefined' && postAggiornato) {
            resp.status(200).send(postEliminato);
        }
        else {
            resp.status(401);
        }
    } catch (error) {
        resp.status(400).send();
    }



    // .then(post => {

    //     resp.status(200).send(post);
    // })
    // .catch(error => {
    //     resp.status(400).send();
    // });
});

module.exports = router;