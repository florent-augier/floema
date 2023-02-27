import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ silent: true });
import express from "express";
import errorHandler from "errorhandler";
import logger from "morgan";
import bodyParser from "body-parser";
import methodOverride from "method-override";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

// const express = require("express");
const app = express();
import path from "path";
import { fileURLToPath } from "url";

import PrismicDOM from "prismic-dom";
import * as prismic from "@prismicio/client";

// const path = require("path");
const port = 3000;

import * as prismicH from "@prismicio/helpers";
import { client } from "./config/prismicConfig.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
console.log(process.env.PRISMIC_CLIENT_ID, process.env.PRISMIC_ENDPOINT);
const apiEndpoint = process.env.PRISMIC_ENDPOINT;

app.use(errorHandler());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(logger("dev"));

app.use((req, res, next) => {
  res.locals.ctx = {
    prismicH,
  };

  res.locals.PrismicDOM = PrismicDOM;
  res.locals.Numbers = (index) => {
    return index == 0
      ? "One"
      : index == 1
      ? "Two"
      : index == 2
      ? "Three"
      : index == 3
      ? "Four"
      : "";
  };

  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const handleRequest = async (client) => {
  const meta = await client.getSingle("meta");
  const preloader = await client.getSingle("preloader");
  const navigation = await client.getSingle("navigation");

  return {
    meta,
    preloader,
    navigation,
  };
};

app.get("/", async (req, res) => {
  const defaults = await handleRequest(client);
  const home = await client.getSingle("home");

  const navigation = await client.getSingle("navigation");

  console.log("navigation", navigation.data.list);

  const collections = await client.getAllByType("collection", {
    fetchLinks: "product.image",
  });

  console.log("home", home);

  res.render("pages/home", { ...defaults, home, collections });
});
app.get("/about", async (req, res) => {
  const defaults = await handleRequest(client);
  const about = await client.getSingle("about");

  res.render("pages/about", { ...defaults, about });
});

app.get("/collections", async (req, res) => {
  const uid = req.params.uid;
  const defaults = await handleRequest(client);
  const home = await client.getSingle("home");

  const collections = await client.getAllByType("collection", {
    fetchLinks: "product.image",
  });
  console.log(collections[0].data.products[0].products_product.url);

  res.render("pages/collections", { ...defaults, home, collections });
});

app.get("/detail/:uid?", async (req, res) => {
  const uid = req.params.uid;

  const defaults = await handleRequest(client);

  let product;

  if (uid) {
    product = await client.getByUID("product", uid, {
      fetchLinks: "collection.title",
    });
  } else {
    product = await client.getByUID("product", "silver-necklace");
  }

  product.data.highlights.forEach((element) => {
    console.log("element", element);
  });

  console.log("product", product);

  res.render("pages/detail", { ...defaults, product });
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
