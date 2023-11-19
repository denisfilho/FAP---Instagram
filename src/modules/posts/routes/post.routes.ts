import { Router } from "express";
import { validateJwtUser } from "../../../commom/middlewares/auth.middleware";
import PostController from "../controllers/post.controller";



export const postRoutes = (): Router => {
    const router = Router();

    //POST /posts
    router.post("/", validateJwtUser, PostController.createPost);

    //GET /posts
    router.get("/", PostController.listPosts);

    return router;
    /*
    Fazer depois
    

    //GET /posts/post_id
    router.get("/:post_id", postController.findOne);
    
    //PATCH /posts/post_id
    router.patch("/:post_id", postController.updatepost);

    //DELETE /posts/post_id
    router.delete("/:post_id", PostController.deletepost);
    
    //POST /posts/authenticate
    router.post("/authenticate", PostController.authenticate)

    */
    
}
