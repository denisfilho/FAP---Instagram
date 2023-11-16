import { startWebServer } from "./app";
import { starDatabase } from "./services/database/app-data-souce";


async function main(){
    try{
        await starDatabase();
        console.log(`Database initialized`);
        await startWebServer();
        console.log(`Web server initialized`);
    } catch (error){
        console.log(error, "Error initializing app");
    }
}

main();