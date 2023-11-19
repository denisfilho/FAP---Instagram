import { Request, Response } from "express";
import { AppDataSource } from "../../../services/database/app-data-souce";
import { User } from "../entities/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../../posts/entities/post.entity";



class UserController{
    async createUser(req: Request, res:Response) {
        const { name, email, password, bio} = req.body;
        try{
            const user = await AppDataSource.getRepository(User).save({
                name: name,
                email: email,
                password_hash: bcrypt.hashSync(password, 8),
                bio: bio
            });
            console.log(`User ${user.id} created`);
            res.status(201).json({ok:true, message: "Usuário criado com sucesso"});

        }catch(error){
            console.log(error, "Error in createUsers");
            return res.status(400).json({message:"Error ao criar usuário"});
        }
    }

    async listUsers (req: Request, res: Response){
        try{
            const users = await AppDataSource.getRepository(User).find({
                select: ['id', 'name', 'bio', 'followers_count', 'followers_count']});
            return res.status(200).json({ok: true, users});
        } catch (error){
            console.log(error, "Error in listUsers");
            return res.status(400).json({message: "Error ao listar usuários"});
        }
    }

    async findOne(req: Request, res: Response) {
        try{
            const user = await AppDataSource.getRepository(User).findOne({
                where: {id: +req.params.user_id} 
            });
            return res.status(200).json({ok: true, user});
        } catch (error){
            console.log(error, 'Error in findOne');
            res.status(500).send({ok: false, error: "error-finding-user"});
        }
    }

    async updateUser(req: Request, res: Response) {
        try{
            const {name, bio} = req.body;
            const user = await AppDataSource.getRepository(User).findOne({
                where: {id: +req.params.user_id} 
            });
            if(!user){
                return res.status(404).json({ok: false, error: "user-not-found"});
            }
            if(name) user.name = name;
            if(bio) user.bio = bio;
            return res.status(200).json({ok: true, user});
        }catch (error){
            console.log(error, "Error in updateUser");
            res.status(500).send({ok: false, error: "error-updating-user"});
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
          const user = await AppDataSource.getRepository(User).findOne({
            where: { id: +req.params.user_id },
          });
    
          if (!user) {
            return res.status(404).json({ ok: false, error: "user-not-found" });
          }
    
          await AppDataSource.getRepository(User).softDelete(user);
          console.log(`User ${user.id} deleted`);
    
          return res
            .status(200)
            .json({ ok: true, message: "Usuário deletado com sucesso" });
        } catch (error) {
          console.log(error, "Error in deleteUser");
          res.status(500).send({ ok: false, error: "error-deleting-user" });
        }
    }

    async listPosts(req: Request, res: Response) {
        try{
            const requestingUser = res.locals.user as User;
            console.log(requestingUser, 'requestingUser');
            const posts = await AppDataSource.getRepository(Post).find({
                where: {user_id: requestingUser.id},
            });

            return res.status(200).json({ok: true, posts: posts});
        } catch(error){
            console.log(error, "Error in listPosts");
            res.status(500).send({ok:false, error:"error-listing-posts"});
        }
    } 

    async listPostByUser(req: Request, res: Response){
        try{
            const user = await AppDataSource.getRepository(User).findOne({
                where: {id: +req.params.user_id},
            });

            if(!user){
                return res.status(404).json({ok: false, error: "user-not-found"});
            }

            const posts =  await AppDataSource.getRepository(Post).find({
                where:{user_id: user.id},
            });

            return res.status(200).json({ok: true, posts: posts});
        }catch(error){
            console.log(error, "Error in listPostsByUser");
            res.status(500).send({ok:false, error: "error-listing-posts"})
        }
    }

    async authenticate(req: Request, res: Response) {
        try{

            //Coletando os dados do req.body
            const { email, password } = req.body;

            //Buscando usuário pelo await
            const user = await AppDataSource.getRepository(User).findOne({
                where: { email: email },
                select: ["id", "name", "email", "password_hash"],
            });

            //Se não encontrar usuário com este email, retorne erro
            if(!user){
                return res.status(404).json({ok: false, error: "user-not-found"});
            }

            //Compara senha encontrada no req.body com o hash armazenado
            if(!bcrypt.compareSync(password, user.password_hash)){
                return res.status(401).json({ok: false, error: "invalid-password"});
            }
            //Gera token JWT
            const token = jwt.sign({id: user.id }, 
                process.env.JWT_SECRET as string, 
                {expiresIn: "1d"},
            );

            // Retorna o token para o usuário
            return res.status(200).json({ok:true, token});
        } catch (error){
            console.log(error, "Error in authenticate");
            res.status(500).send({ok:false, error:"error-authenticating-user"});
        }
    }
}

export default new UserController();