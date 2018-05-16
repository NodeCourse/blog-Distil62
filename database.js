const Sequelize = require('sequelize');

const db = new Sequelize('sql2238055', 'sql2238055', 'iI9*wE1%', {
    host : 'sql2.freemysqlhosting.net',
    dialect : 'mysql'
});
//Jp6)$wveFh)$lkhI
//jeuxvideocom@gifto12.com

const Article = db.define('article', {
        author : { type: Sequelize.STRING },
        imgSrc : { type: Sequelize.STRING },
        description : { type: Sequelize.STRING }
    });

const Response = db.define('response', {
    authorRes : { type: Sequelize.STRING },
    contentRes :  { type: Sequelize.STRING }
});

Article.hasMany(Response, {as : 'responses'});
Response.belongsTo(Article);

let getAllArticles = (next)=>{
    return Article
        .findAll()
        .then((res) => {
            next(res);
        });
}

let getAllResponse = (next) => {
    return Response
        .findAll()
        .then((res)=> {
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

let createResponse = (response)=>{
    return Response
        .sync()
        .then(()=> {
            Response.create({
                articleId : response.articleId,
                authorRes : response.authorRes,
                contentRes : response.contentRes
            })
        })
}

module.exports = 
{
    db : db,
    Article : Article,
    Response : Response,
    getAllArticles : getAllArticles,
    getAllResponse : getAllResponse,
    createArticle : createArticle,
    createResponse : createResponse
};