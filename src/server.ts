import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3003;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routersPath = path.join(__dirname, "routers");

app.use(express.json());
app.use(morgan("dev"));

// ✅ ລໍຖ້າໃຫ້ທຸກເສັ້ນທາງໂຫຼດກ່ອນ ຈາກນັ້ນເລີ່ມເຊີບເວີ.
const loadRoutes = async () => {
    const files = fs.readdirSync(routersPath);

    for (const file of files) {
        const module = await import(`./routers/${file}`);
        app.use("/api", module.default);
        console.log(`✅ loaded: ${file}`);
    }

    app.listen(port, () => {
        console.log(`==============================`);
        console.log(`server running on port ${port}`);
        console.log(`==============================`);
    });
};

loadRoutes();
