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
    };

    const result = await ProductsModel.paginate(filter, options);
    res.render("productsList", {
      products: result.docs,
      paging: {
        totalPages: result.totalPages,
        page: result.page,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
      },
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.render("productsList", { products: [] });
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
    let cart = await CartModel.findOne();

    if (!cart) {
      cart = await CartModel.create({ products: [] });
    }

    return res.render("productDetail", {
      product,
      cartId: cart._id.toString(),
    });
  } catch (error) {
    console.error("Error al obtener detalle del producto:", error);
    res.render("productDetail", { error: "Error interno" });
  }
};

export const viewsCartDetailController = async (req, res) => {
  try {
    const { cid } = req.params;

    // Buscar el carrito por ID y hacer populate de los productos
    const cart = await CartModel.findById(cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cartDetail", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener el carrito");
  }
};
