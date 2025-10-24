import fs from "fs/promises";

class ProductManager {
    constructor(path) {
        this.path = path;
    }
};

async getProducts() {
    if (!fs.existsSync(this.path)) return[]
    const data = await fs.promises.readFile(this.path, "utf-8")
    return JSON.parse(data)
}
