export const getPagination = (page: number, limit = 10) => {
    const skip = (page - 1) * limit
    return {
        skip,
        take: limit
    }
}

export const paginationResponse = (data: unknown, total: number, page: number, limit: number) => {


    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }
}