import { Document, Query } from "mongoose";

interface QueryString {
    [key: string]: any;
    page?: string | number;
    sort?: string;
    limit?: string | number;
    fields?: string;
}

class APIFeatures<Doc extends Document> {
    query: Query<Doc[], Doc>;
    queryString: QueryString;

    constructor(query: Query<Doc[], Doc>, queryString: QueryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter(): this {
        const queryObj: QueryString = { ...this.queryString };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryObj[el]);

        // Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`,
        );
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort(): this {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort?.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    limitFields(): this {
        if (this.queryString.fields) {
            const fields = this.queryString.fields?.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
        }
        return this;
    }

    paginate(): this {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

export default APIFeatures;
