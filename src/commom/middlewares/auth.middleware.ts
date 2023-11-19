import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../services/database/app-data-souce";
import { User } from "../../modules/users/entities/user.entity";



export async function validateJwtUser(req: Request, res: Response, next: NextFunction) {
    try{
        // Busca o token no cabeçalho authorization
        const token = req.headers["authorization"]?.split(" ")[1]; //Vem na String assim: Bearer 123123
        if(!token) return res.status(401).json({message: "no token provided"});
        
        // Verifica se o token é válido
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as {
            id: number, 
            email: string
        };

        const {id} = jwtPayload;
        const user = await AppDataSource.getRepository(User).findOne({
            where: { id },
        });

        if(!user){
            return res.status(401).json({message: "Invalid token"});
        }

        res.locals.user = user;
        next();
    }catch (error){
        console.log(error, "Error on validadeJwtuser");
        return res.status(401).json({message: "not-possible-to-authenticate"});
    }
    
}
    