const postModel = require('../models/postModels')

const addPosts = async (req,res) =>{
    console.log('postController')
    try{
        const {image, title, description, tags} = req.body;
        const {user} = req.user;
    // Create post in our database
      const post = await postModel.create({
        image,
        title,
        description,
        tags,
        createdBy: user
       
      });

      const post_id = post._id
      return res.status(201).send({message: 'Post created successfully', post_id})

    }
    catch(err){

        console.log(err)
        if(err.code = 11000){
        return res.status(500).send({message: "Please add another title, title should be unique"});
        }
        res.status(500).send(err.message)

    }

}


const getPosts = async (req,res) =>{
    console.log('getpostController')
    try{
    // Get all posts from database in descending order of creation
      const posts = await postModel.find({}).select(["createdBy", "image", "title", "description", "tags", "createdAt"]).sort({createdAt : -1});
      if(posts.length){
      return res.status(200).send({message: 'Success', posts})
      }
      return res.status(200).send({message: "No Posts found."})

    }
    catch(err){

        console.log(err)
        res.status(500).send(err.message);
    }

}

const updatePost = async (req,res) =>{
    console.log('updatepostController')
    try{

      return res.status(200).send({message: "No Posts found."})

    }
    catch(err){

        console.log(err)
        res.status(500).send(err.message);
    }

}

const deletePost = async (req,res) =>{
    console.log('deletepostController')
    try{
      const {id, title} = req.body;
      let deleteById = false;
      let deleteByTitle =false;
    // Delete post by id
    if(id){
      deleteById = await postModel.findByIdAndDelete({_id: id}).catch(e=> console.log(e))
    }
      if(title){
      deleteByTitle = await postModel.findOneAndDelete({title}).catch(e=> console.log(e))
      
      }
      if(deleteById || deleteByTitle) return res.status(200).send({message: "Post deleted"})
      return res.status(500).send({message: "Failed to delete post."});

    }
    catch(err){

        console.log(err)
        res.status(500).send({message: "Failed to delete post."});
    }

}

module.exports = {addPosts, getPosts, updatePost, deletePost}