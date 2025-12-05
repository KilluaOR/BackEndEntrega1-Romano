import mongoose from "mongoose";
import ProductsModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";

export const viewsHomeController = async (req, res) => {
  try {
    const products = await ProductsModel.find().lean();
    res.render("home", { products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render("home", { products: [] });
  }
};

export const viewsRTPController = async (req, res) => {
  try {
    const products = await ProductsModel.find().lean();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render("realTimeProducts", { products: [] });
  }
};

export const viewsPLController = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query === "true" || query === "false") {
      filter.status = query === "true";
    } else if (query) {
      filter.category = query;
    }

    let sortOption = {};

    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sortOption,
      lean: true,
    };

    const result = await ProductsModel.paginate(filter, options);

    const products = result.docs;
    let categories = [];
    try {
      categories = await ProductsModel.distinct("category");
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      categories = [];
    }

    if (!req.session) {
      return res.status(500).send("Error de sesión: inténtalo de nuevo");
    }

    let cartId;
    if (!req.session.cartId) {
      const newCart = await CartModel.create({ products: [] });
      req.session.cartId = newCart._id;
      cartId = newCart._id;
    } else {
      cartId = req.session.cartId;
    }

    res.render("productsList", {
      products: products,
      paging: {
        totalPages: result.totalPages,
        page: result.page,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
      },
      cartId: cartId ? cartId.toString() : null,
      categories: categories || [],
      currentQuery: query || "",
      currentSort: sort || "",
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    console.error("Stack trace:", error.stack);
    res.render("productsList", {
      products: [],
      paging: {},
      cartId: null,
      categories: [],
      currentQuery: "",
      currentSort: "",
    });
  }
};

export const viewsProductDetailController = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductsModel.findById(pid).lean();

    if (!product) {
      return res
        .status(404)
        .render("productDetail", { error: "El producto solicitado no existe" });
    }

    if (!req.session) {
      return res.status(500).send("Error de sesión: inténtalo de nuevo");
    }

    let cartId;
    if (!req.session.cartId) {
      const newCart = await CartModel.create({ products: [] });
      req.session.cartId = newCart._id;
      cartId = newCart._id;
    } else {
      cartId = req.session.cartId;
    }

    return res.render("productDetail", {
      product,
      cartId: cartId.toString(),
    });
  } catch (error) {
    console.error("Error al obtener detalle del producto:", error);
    res.render("productDetail", { error: "Error interno" });
  }
};

export const viewsCartDetailController = async (req, res) => {
  try {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).render("cartDetail", {
        error: "ID de carrito inválido",
        cart: null,
      });
    }

    let cart = await CartModel.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      const newCart = await CartModel.create({ products: [] });
      cart = await CartModel.findById(newCart._id)
        .populate("products.product")
        .lean();

      if (req.session) {
        req.session.cartId = newCart._id;
      }

      return res.redirect(`/carts/${newCart._id}`);
    }

    res.render("cartDetail", {
      cart: cart,
    });
  } catch (error) {
    console.error("Error en viewsCartDetailController:", error);
    res.status(500).render("cartDetail", {
      error: "Error al obtener el carrito",
      cart: null,
    });
  }
};
