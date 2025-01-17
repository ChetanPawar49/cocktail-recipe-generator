// Importing express and axios
import express from "express";
import axios from "axios";

// Creating an express app and setting the port number.
const app = express();
const port = 3000;

// Using the public folder for static files.
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", { content: "Waiting for data", ingredients: [] });
});

app.post("/get-random", async (req, res) => {
    try {
        const result = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php");
        const drink = result.data.drinks[0]; // Access the first drink
        console.log(result.data);
        // console.log(result.data.drinks[0].strDrink);

        // Create an array of ingredients and measures
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push({ ingredient, measure: measure || "as needed" });
            }
        }

        res.render("index.ejs", { content: drink, ingredients: ingredients });
    } catch (error) {
        console.log(error.message);
        res.render("index.ejs", { content: error.response, ingredients: [] });
        // console.log(error.response.data);
        // res.status(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port: http://localhost:${port}`);
});