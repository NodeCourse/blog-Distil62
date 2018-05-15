const Sequelize = require('sequelize');

const db = new Sequelize('mysql', 'root', 'lol123', {
    host : 'localhost',
    dialect : 'mysql'
});

let Article = db.define('article', {
        author : { type: Sequelize.STRING },
        imgSrc : { type: Sequelize.STRING },
        description : { type: Sequelize.STRING }
    });

let getAllArticles = (next)=>{
    return Article
        .findAll()
        .then((res) => {
            next(res);
        });
}

let createArticle = (article)=>{
    return Article
        .sync()
        .then(()=>{
            Article.create({
                author : article.author,
                imgSrc : article.imgSrc,
                description : article.description
            });
        });
}

module.exports = 
{
    db : db,
    Article : Article,
    getAllArticles : getAllArticles,
    createArticle : createArticle
};

/*
{
        author : article.author,
        imgSrc : article.imgSrc,
        description : article.description
    }
*/