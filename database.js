const Sequelize = require('sequelize');

const db = new Sequelize('sql2238055', 'sql2238055', 'iI9*wE1%', {
    host : 'sql2.freemysqlhosting.net',
    dialect : 'mysql'
});
//Jp6)$wveFh)$lkhI
//jeuxvideocom@gifto12.com

const User = db.define('user', {
    username : { type: Sequelize.STRING },
    password : { type: Sequelize.STRING },
    icon : { type: Sequelize.STRING, defaultValue : "https://d2ln1xbi067hum.cloudfront.net/assets/default_user-abdf6434cda029ecd32423baac4ec238.png"},
    articleLiked : { type: Sequelize.STRING, defaultValue : ""}
});

const Article = db.define('article', {
        title : { type: Sequelize.STRING },
        author : { type: Sequelize.STRING },
        imgSrc : { type: Sequelize.STRING },
        description : { type: Sequelize.STRING },
        like : { type: Sequelize.INTEGER, defaultValue : 0 },
        dislike : { type: Sequelize.INTEGER, defaultValue : 0 }
    });

const Response = db.define('response', {
    authorRes : { type: Sequelize.STRING },
    contentRes :  { type: Sequelize.STRING }
});

User.hasMany(Article, {as : 'article'});
User.hasMany(Response, {as : 'responses'});

Article.hasMany(Response, {as : 'responses'});
Article.belongsTo(User);

Response.belongsTo(Article);
Response.belongsTo(User);

//db.sync();
//db.drop();

const getAllUsers = (next) => {
    return User
        .findAll()
        .then((res)=> {
            next(res);
        });
}

const getUserByName = (username, next) => {
    return User
        .findOne({where: {username: username}})
        .then((res)=> {
            next(res);
        });
}


const getAllArticles = (next)=>{
    return Article
        .findAll()
        .then((res) => {
            next(res);
        });
}

const getAllArticlesById = (id, next) =>{
    return Article
        .findAll({where : {userId : id}})
        .then((res)=>{
            next(res)
        });
}

const getAllResponse = (next) => {
    return Response
        .findAll()
        .then((res)=> {
            next(res);
        });
}

const createUser = (user) => {
    return User
        .sync()
        .then(()=>{
            User.create({
                username : user.username,
                password : user.password,
            })
        })
}

const likeArticle = (idUser, idArticle, type) => {
    User
        .findOne({where: {id: idUser}})
        .then((res)=> {
            User.update(
                {articleLiked : res.articleLiked + idArticle + ",",},
                {where: {id: idUser}}
            )
        });
    Article
        .findOne({where: {id: idArticle}})
        .then((res)=>{
            Article.update(
                {[type] : res[type] + 1,},
                {where: {id: idArticle}}
            )
        });
}

const createArticle = (article)=>{
    return Article
        .sync()
        .then(()=>{
            Article.create({
                title : article.title,
                author : article.author,
                userId : article.userId,
                imgSrc : article.imgSrc,
                description : article.description
            });
        });
}

const createResponse = (response)=>{
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
    getAllUsers : getAllUsers,
    getUserByName : getUserByName,
    getAllArticles : getAllArticles,
    getAllArticlesById : getAllArticlesById,
    getAllResponse : getAllResponse,
    createUser : createUser,
    createArticle : createArticle,
    createResponse : createResponse,
    likeArticle : likeArticle
};