/**
 * Autor : Ricardo Cardoso Miranda
 * Data  : 29/04/2023
 */

/** imports */

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express()
const port = 3000

// Config JSON response
app.use(express.json());

//Models
const User = require('./models/User')

// Open Route
app.get("/", (req, res) => {
    res.status(200).json({ msg: "Bem vindo a API!" });
});


app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório' })
    }
    if (!email) {
        return res.status(422).json({ msg: 'O email é obrigatório' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatório' })
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'A senhas não conferem' })
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail!" });
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({
        name,
        email,
        password : passwordHash
    });

    try {
        await user.save();

        res.status(201).json({ msg: "Usuário criado com sucesso!" });
    } catch (error) {
        res.status(500).json({ msg: error });
    }
});

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(`mongodb+srv://ricardo:PObyBIs36i7ZjbVD@cluster0.jzaj60b.mongodb.net/nodejsjwt?retryWrites=true&w=majority`)
    .then(() => {
        console.log("Conectou ao banco!");
        app.listen(port, () => {
            console.log(`App rodando na porta:${port}`)
        })
    }).catch((err) => console.log(err));


