const { getAllOrders } = require('../../utils/getOrderItems');


const getAllorders = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = '', status = '' } = req.query;
        console.log(status)
        page = parseInt(page);
        limit = parseInt(limit);

        const { orders, totalOrders } = await getAllOrders(page, limit, search, status);
        // console.log(orders[0].items[0].productInfo)
        console.log(totalOrders)
        res.status(200).json({
            success: true,
            message: 'Orders fetched successfully',
            orders:JSON.stringify(orders),
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders
        });
    } catch (error) {
        console.error("Error returning order:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};


module.exports = { getAllorders };
