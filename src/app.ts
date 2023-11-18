import express from 'express'
import { UserRoutes } from './modules/users/routes/user.routes';



export const app = express();

app.use(express.json());

app.use("/users", UserRoutes());

export async function startWebServer(){
    return new Promise((resolve)=> {
        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
            resolve(null);
        });
    });
}