const { getAllOrders } = require('../../utils/getOrderItems');

const getAllorders = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        console.log(page, limit)
        const allOrders = await getAllOrders();
        const startIndex = (page - 1) * limit;
        const paginatedOrders = allOrders.slice(startIndex, startIndex + limit);
        console.log(paginatedOrders.length)
        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders: paginatedOrders,
            currentPage: page,
            totalPages: Math.ceil(allOrders.length / limit),
            totalOrders: allOrders.length
        });
    } catch (error) {
        console.error("Error returning order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

module.exports = { getAllorders };
