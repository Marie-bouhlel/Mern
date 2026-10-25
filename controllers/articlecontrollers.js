const Article = require ('../models/articleModel') ;
const User = require ('../models/userModel') ;
let articles = [
{ id: 1 , title : 'Welcome to the blog ', author : 'Admin ' } ,
{ id: 2 , title : 'My first Express server ', author : 'Aya' } ,
{ id: 3 , title : 'Testing an API with Postman ', author : 'Aya ' }
];
let prochaineId = 4;

 const getAllArticles = async (req , res) => {
try {
    const articles = await Article.find ().populate ('author', 'name', 'email') ;
res.status (200).json( articles ) ;
} catch ( err) {
res.status(500).json({ message : err.message }) ;
}
};

 
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email');

    if (!article) {
      return res.status(404).json({
        message: 'Article not found'
      });
    }

    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const createArticle = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({
        message: 'title, content, and authorId are required'
      });
    }

    // Verify that the author exists in the 'users' collection
    const author = await User.findById(authorId);

    if (!author) {
      return res.status(404).json({
        message: 'Author not found (invalid authorId)'
      });
    }

    const newArticle = await Article.create({
      title,
      content,
      author: authorId
    });

    const populatedArticle = await newArticle.populate('author', 'name email');

    res.status(201).json(populatedArticle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return updated doc and execute validations
    );

    if (!article) {
      return res.status(404).json({
        message: 'Article not found for update'
      });
    }

    const populated = await article.populate('author', 'name email');

    res.status(200).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        message: 'Article not found for deletion'
      });
    }

    res.status(200).json({
      message: 'Article deleted successfully',
      id: req.params.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle
};
