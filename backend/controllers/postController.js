const Post = require("../models/post");
var { ObjectID } = require("mongodb");
const _ = require("lodash");
const { PagedResult } = require("../viewModels/pageresult");


exports.getAllPosts = async (req, resp) => {

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find({});

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    try {
        var pageResult = new PagedResult(currentPage, pageSize);

        pageResult.resultsArray = await postQuery;

        pageResult.count = await Post.count();

        resp.status(200).json({ pagedResult: pageResult });
    } catch (error) {
        resp.status(500).json({ messaggioErrore: "Errore lettura Posts!" });
    }
};

exports.getPostById = async (req, resp) => {

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).json({ messaggioErrore: "Id non valido." });
    }

    try {
        const post = await Post.findOne({ _id: req.params.id });

        resp.status(200).send(post);
    } catch (error) {
        resp.status(500).json({ messaggioErrore: "Errore interno." });
    }
};

exports.createPost = async (req, resp) => {

    console.log("file", req.file);
    console.log("body", req.body);

    const url = req.protocol + '://' + req.get('host');

    var obj = _.pick(req.body, ["title", "content"]);

    obj['imagePath'] = url + '/images/' + req.file.filename;
    obj['creator'] = req.utenteloggato.id;

    const post = new Post(obj);

    try {
        var result = await post.save();

        resp.status(200).send({ id: result._id, title: result.title, content: result.content, imagePath: result.imagePath });
    } catch (error) {
        resp.status(500).json({ messaggioErrore: "Errore salvataggio Post!" });
    }
};

exports.updatePostById = async (req, resp) => {

    console.log("file", req.file);
    console.log("body", req.body);

    let imageP = req.body.imagePath;
    let url = "";

    if (typeof req.file !== "undefined" && req.file !== null) {
        url = req.protocol + '://' + req.get('host');
        imageP = url + "/images/" + req.file.filename;
    }

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).json({ messaggioErrore: "Id non valido." });
    }

    var obj = _.pick(req.body, ["title", "content"]);
    obj['imagePath'] = url + '/images/' + req.file.filename;
    obj['creator'] = req.utenteloggato.id;

    try {

        const postAggiornato = await Post.findOneAndUpdate({ _id: req.params.id, creator: req.utenteloggato.id }, obj);

        if (typeof postAggiornato != 'undefined' && postAggiornato) {
            resp.status(200).json(postAggiornato);
        }
        else {
            resp.status(401).json({ messaggioErrore: "Post non trovato." });
        }
    } catch (error) {
        resp.status(500).json({ messaggioErrore: "Errore interno." });
    }
};

exports.deletePostById = async (req, resp) => {

    if (!ObjectID.isValid(req.params.id)) {
        return resp.status(404).json({ messaggioErrore: "Id non valido." })
    }

    try {
        const postEliminato = await Post.deleteOne({ _id: req.params.id, creator: req.utenteloggato.id });

        if (typeof postEliminato != 'undefined' && postEliminato) {
            resp.status(200).json(postEliminato);
        }
        else {
            resp.status(401).json({ messaggioErrore: "Post non trovato." })
        }
    } catch (error) {
        resp.status(500).json({ messaggioErrore: "Errore interno." });
    }
};