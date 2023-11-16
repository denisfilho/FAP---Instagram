import { DataSource } from "typeorm";
import { User } from "../../modules/users/entities/user.entity";

console.log(process.env.DATABASE_PASSWORD, "process.env.DATABASE_PASSWORD");

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    //entities: [User, Post], Metodo 1
    entities: [
        process.env.NODE_ENV === "production"
            ? "dist/src/modules/**/*.entity.js"
            : "src/modules/**/*.entity.ts"
    ],
    synchronize: true
});

//Espera o AppDataSource Inicializar
export async function starDatabase(){
    try{
        await AppDataSource.initialize();
    }catch (error){
        console.error(error, "Error initializing database");
        throw error;
    }
}