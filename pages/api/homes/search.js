import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { priceMin, priceMax, guests, beds, baths } = req.query;

      const errors = [];

      if (priceMin !== undefined) {
        const num = Number(priceMin);
        if (isNaN(num) || num < 0) {
          errors.push("priceMin must be a non-negative number");
        }
      }

      if (priceMax !== undefined) {
        const num = Number(priceMax);
        if (isNaN(num) || num < 0) {
          errors.push("priceMax must be a non-negative number");
        }
      }

      if (priceMin !== undefined && priceMax !== undefined) {
        if (Number(priceMin) > Number(priceMax)) {
          errors.push("priceMin cannot be greater than priceMax");
        }
      }

      if (guests !== undefined) {
        const num = Number(guests);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
          errors.push("guests must be a non-negative integer");
        }
      }

      if (beds !== undefined) {
        const num = Number(beds);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
          errors.push("beds must be a non-negative integer");
        }
      }

      if (baths !== undefined) {
        const num = Number(baths);
        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
          errors.push("baths must be a non-negative integer");
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Invalid filter parameters",
          errors: errors,
        });
      }

      const where = {};

      if (priceMin !== undefined) {
        where.price = { ...where.price, gte: Number(priceMin) };
      }

      if (priceMax !== undefined) {
        where.price = { ...where.price, lte: Number(priceMax) };
      }

      if (guests !== undefined && Number(guests) > 0) {
        where.guests = { gte: Number(guests) };
      }

      if (beds !== undefined && Number(beds) > 0) {
        where.beds = { gte: Number(beds) };
      }

      if (baths !== undefined && Number(baths) > 0) {
        where.baths = { gte: Number(baths) };
      }

      const homes = await prisma.home.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(homes);
    } catch (e) {
      console.error("Search error:", e);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
