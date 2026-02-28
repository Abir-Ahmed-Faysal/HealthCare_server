import { IQueryConfig, IQueryParams, PrismaCountArgs, PrismaFindManyArgs, PrismaModelDelegate, PrismaNumberFilter, PrismaStringFilter, PrismaWhereConditions } from "../interfaces/query.interface";


export class QueryBuilder<
    T,
    TWhereInput = Record<string, unknown>,
    TInclude = Record<string, unknown>,
> {

    private query: PrismaFindManyArgs;
    private countquery: PrismaCountArgs;
    private page: number = 1
    private limit: number = 10
    private skip: number = 0;
    private sortOrder: 'asc' | 'desc' = 'desc'
    private selectFields: Record<string, boolean> = {};


    constructor(
        private model: PrismaModelDelegate,
        private queryParams: IQueryParams,
        private config: IQueryConfig
    ) {

        this.query = {
            where: {},
            include: {},
            orderBy: {},
            skip: 0,
            take: 10
        }

        this.countquery = {
            where: {}
        }
    }

    search(): this {
        const { searchTerm } = this.queryParams
        const { searchableFields } = this.config

        if (searchTerm && searchableFields && searchableFields.length) {

            const searchConditions: Record<string, unknown>[] = searchableFields.map((field) => {

                if (field.includes('.')) {
                    const parts = field.split('.')

                    if (parts.length === 2) {
                        const [relation, nestedField] = parts

                        const stringFilter: PrismaStringFilter = {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }

                        return {
                            [relation]: {
                                [nestedField]: stringFilter
                            }
                        }
                    } else if (parts.length === 3) {
                        const [relation, nestedRelation, nestedField] = parts

                        const stringFilter: PrismaStringFilter = {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }

                        return {
                            [relation]: {
                                [nestedRelation]: {
                                    [nestedField]: stringFilter
                                }
                            }
                        }
                    }

                    const stringFilter: PrismaStringFilter = {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }

                    return {
                        [field]: stringFilter
                    }
                }


                const stringFilter: PrismaStringFilter = {
                    contains: searchTerm,
                    mode: 'insensitive'
                }

                return {
                    [field]: stringFilter
                }
            })

            const whereConditions = this.query.where as PrismaWhereConditions

            whereConditions.OR = searchConditions

            const countWhereConditions = this.countquery.where as PrismaWhereConditions
            countWhereConditions.OR = searchConditions
        }

        return this
    }

    filter(): this {

        const { filterableFields } = this.config;
        const excludedField = ['searchTerm', 'page', 'limit', 'sortBy', 'sortOrder', 'fields', 'include'];

        const filterParams: Record<string, unknown> = {};

        Object.keys(this.queryParams).forEach((key) => {
            if (!excludedField.includes(key)) {
                filterParams[key] = this.queryParams[key];
            }
        });

        const queryWhere = this.query.where as Record<string, unknown>;
        const countQueryWhere = this.countquery.where as Record<string, unknown>;

        Object.keys(filterParams).forEach((key) => {
            const value = filterParams[key];

            if (value === undefined || value === "") {
                return;
            }

            const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);


            if (!isAllowedField) {
                return;
            }


            if (key.includes(".")) {
                const parts = key.split(".");

                if (filterableFields && !filterableFields.includes(key)) {
                    return;
                }

                if (parts.length === 2) {
                    const [relation, nestedField] = parts;

                    if (!queryWhere[relation]) {
                        queryWhere[relation] = {};
                        countQueryWhere[relation] = {};
                    }

                    const queryRelation = queryWhere[relation] as Record<string, unknown>;
                    const countRelation = countQueryWhere[relation] as Record<string, unknown>;

                    // 🔹 preserve previous fields
                    queryRelation[nestedField] =
                        typeof value === "object" &&
                            value !== null &&
                            !Array.isArray(value)
                            ? this.parseRangeFilter(value as Record<string, string | number>)
                            : this.parseFilterValue(value);

                    countRelation[nestedField] =
                        typeof value === "object" &&
                            value !== null &&
                            !Array.isArray(value)
                            ? this.parseRangeFilter(value as Record<string, string | number>)
                            : this.parseFilterValue(value);

                    return;
                } else if (parts.length === 3) {
                    const [relation, nestedRelation, nestedField] = parts;

                    if (!queryWhere[relation]) {
                        queryWhere[relation] = { some: {} };
                        countQueryWhere[relation] = { some: {} };
                    }

                    const queryRelation = queryWhere[relation] as Record<string, unknown>;
                    const countRelation = countQueryWhere[relation] as Record<string, unknown>;

                    if (!queryRelation.some) {
                        queryRelation.some = {};
                    }
                    if (!countRelation.some) {
                        countRelation.some = {};
                    }

                    const querySome = queryRelation.some as Record<string, unknown>;
                    const countSome = countRelation.some as Record<string, unknown>;

                    if (!querySome[nestedRelation]) {
                        querySome[nestedRelation] = {};
                    }
                    if (!countSome[nestedRelation]) {
                        countSome[nestedRelation] = {};
                    }

                    const queryNestedRelation = querySome[nestedRelation] as Record<string, unknown>;
                    const countNestedRelation = countSome[nestedRelation] as Record<string, unknown>;

                    //  fix: preserve previous nested fields
                    queryNestedRelation[nestedField] = typeof value === "object" &&
                        value !== null &&
                        !Array.isArray(value)
                        ? this.parseRangeFilter(value as Record<string, string | number>)
                        : this.parseFilterValue(value);
                    countNestedRelation[nestedField] = typeof value === "object" &&
                        value !== null &&
                        !Array.isArray(value)
                        ? this.parseRangeFilter(value as Record<string, string | number>)
                        : this.parseFilterValue(value);

                    return;
                }

                return;
            }

            if (!isAllowedField) {
                return;
            }


            // Range filter parsing
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                queryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                countQueryWhere[key] = this.parseRangeFilter(value as Record<string, string | number>);
                return;
            }

            // Direct value parsing
            queryWhere[key] = this.parseFilterValue(value);
            countQueryWhere[key] = this.parseFilterValue(value);
        });

        return this;
    }


    paginate(): this {
        const rawPage = Number(this.queryParams.page);
        const rawLimit = Number(this.queryParams.limit);

        const page = rawPage > 0 ? rawPage : 1;

        const maxLimit = this.config?.maxLimit || 100;
        const limit =
            rawLimit > 0
                ? Math.min(rawLimit, maxLimit)
                : 10;

        const skip = (page - 1) * limit;

        this.page = page;
        this.limit = limit;
        this.skip = skip;

        this.query.skip = skip;
        this.query.take = limit;

        return this;
    }


    sort(): this {
        const sortBy = this.queryParams.sortBy || "createdAt";
        const sortOrder =
            this.queryParams.sortOrder === "asc" ? "asc" : "desc";

        if (sortBy.includes(".")) {
            const parts = sortBy.split(".");

            // 2-level nesting: profile.name
            if (parts.length === 2) {
                const [relation, field] = parts;

                this.query.orderBy = {
                    [relation]: {
                        [field]: sortOrder
                    }
                };

                return this;
            }

            // 3-level nesting: post.author.name
            if (parts.length === 3) {
                const [relation, nestedRelation, field] = parts;

                this.query.orderBy = {
                    [relation]: {
                        [nestedRelation]: {
                            [field]: sortOrder
                        }
                    }
                };

                return this;
            }

            return this;
        }

        // Normal field sorting
        this.query.orderBy = {
            [sortBy]: sortOrder
        };

        return this;
    }


    fields(): this {
        const fieldsParam = this.queryParams.fields;

        if (fieldsParam && typeof fieldsParam === 'string') {

            const fieldArray = fieldsParam
                ?.split(",")
                ?.map((field) => field.trim())
                .filter(Boolean); // খালি স্ট্রিং রিমুভ

            this.selectFields = {}; // reset

            fieldArray?.forEach((field) => {
                this.selectFields[field] = true; // সব ফিল্ড true
            });

            this.query.select = this.selectFields; //  TypeScript safe
            delete this.query.include; // optional, select ব্যবহার করলে include remove করা ভালো
        }
        return this;
    }



    private parseFilterValue(value: unknown): unknown {

        if (value === 'true') return true;
        if (value === 'false') return false;

        if (typeof value === 'string' && !isNaN(Number(value)) && value != "") {
            return Number(value);
        }

        if (Array.isArray(value)) {
            return { in: value.map((item) => this.parseFilterValue(item)) };
        }

        return value;
    }


    private parseRangeFilter(
        value: Record<string, string | number>
    ): PrismaNumberFilter | PrismaStringFilter | Record<string, unknown> {

        const rangeQuery: Record<string, string | number | (string | number)[]> = {};

        Object.keys(value).forEach((operator) => {
            const operatorValue = value[operator];

            const parsedValue: string | number =
                typeof operatorValue === 'string' && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;

            switch (operator) {
                case 'lt':
                case 'lte':
                case 'gt':
                case 'gte':
                case 'equals':
                case 'not':
                case 'contains':
                case 'startsWith':
                case 'endsWith':
                    rangeQuery[operator] = parsedValue;
                    break;

                case 'in':
                case 'notIn':
                    if (Array.isArray(operatorValue)) {
                        rangeQuery[operator] = operatorValue;
                    } else {
                        rangeQuery[operator] = [parsedValue];
                    }
                    break;
                default:
                    break;
            }
        });

        return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
    }
}