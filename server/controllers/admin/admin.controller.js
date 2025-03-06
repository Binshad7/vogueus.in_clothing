const Admin = require('../../models/userSchema');
const generateToken = require('../../utils/genarateToken');
const { comparePassword } = require('../../utils/bcryptPassowrd')
const orderSchema = require('../../models/orderSchema')
const moment = require('moment');
const userSchema = require('../../models/userSchema')

const adminLogin = async (req, res) => {
    try {
        var { email, password } = req.body;
        const ExistingAdmin = await Admin.findOne({ email });
        if (!ExistingAdmin) {

            return res.status(400).json({ success: false, message: "Admin does not exist" });
        }
        const isPasswordCorrect = await comparePassword(password, ExistingAdmin.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        if (ExistingAdmin.role !== 'admin') {
            return res.status(400).json({ success: false, message: "You are not an admin" });
        }

        if (ExistingAdmin.isBlock) {
            return res.status(400).json({ success: false, message: "You are blocked by admin" });
        }
        await generateToken(ExistingAdmin._id, res);

        var { password, googleId, ...admin } = ExistingAdmin._doc;

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            admin
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const adminRefresh = (req, res) => {
    try {
        const admin = req.user;
        if (admin.isBlock) {
            return res.status(401).json({ success: false, message: 'admin is blocked' })
        }
        if (admin.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not valid Admin' })
        }
        res.status(200).json({ success: true, message: 'Valid Admin', admin })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const adminLogout = async (req, res) => {
    try {
        res.clearCookie("vogueusToken")
        res.status(200).json({ success: true, message: "Admin Logged out success fully completed " })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const bestSellingProducts = async () => {
    let bestSellingProductss = await orderSchema.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: '$items.productId',
                sales: { $sum: '$items.quantity' }
            }
        },
        {
            $lookup: {
                from: 'products',
                foreignField: '_id',
                localField: '_id',
                as: "products"
            }
        },
        { $unwind: '$products' },
        {
            $lookup: {
                from: 'categories',
                foreignField: '_id',
                localField: 'products.category',
                as: "categoryDetails"
            }
        },
        { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                id: "$_id",
                name: "$products.productName",
                regularPrice: "$products.regularPrice",
                currentPrice: "$products.currentPrice",
                category: "$categoryDetails.categoryName",
                sales: 1,
                image: { $arrayElemAt: ["$products.images", 0] }
            }
        },
        { $sort: { sales: -1 } },
        { $limit: 5 }
    ]);
    return bestSellingProductss
}
const latestOrders = async (req, res) => {
    const latestOrderss = await orderSchema.find()
        .sort({ orderedAt: -1 })
        .limit(5)
        .populate('userId', 'userName')
        .lean();
    return latestOrderss
}
const bestSellingCategories = async () => {
    let bestSellingCategories = await orderSchema.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.productId",
                totalSales: { $sum: "$items.quantity" },
                totalAmount: { $sum: { $multiply: ["$items.quantity", "$items.productPrice"] } }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: "$productDetails" },
        {
            $lookup: {
                from: "categories",
                localField: "productDetails.category",
                foreignField: "_id",
                as: "categoryDetails"
            }
        },
        { $unwind: "$categoryDetails" },
        {
            $group: {
                _id: "$categoryDetails._id",
                name: { $first: "$categoryDetails.categoryName" },
                sales: { $sum: "$totalSales" },
                totalRevenue: { $sum: "$totalAmount" }
            }
        },
        { $sort: { sales: -1 } },
        {
            $group: {
                _id: null,
                totalSalesSum: { $sum: "$sales" },
                totalRevenueSum: { $sum: "$totalRevenue" },
                categories: { $push: "$$ROOT" }
            }
        },
        { $unwind: "$categories" },
        {
            $project: {
                _id: "$categories._id",
                name: "$categories.name",
                sales: "$categories.sales",
                totalRevenue: "$categories.totalRevenue",
                percentage: {
                    $multiply: [{ $divide: ["$categories.sales", "$totalSalesSum"] }, 100]
                }
            }
        },
        { $sort: { sales: -1 } }
    ]);
    return bestSellingCategories
};
const getSalesDynamicData = async (timeFrame = 'monthly') => {
    const aggregationPipeline = [];

    // Match only non-cancelled orders
    aggregationPipeline.push({
        $match: {
            orderStatus: { $ne: 'cancelled' },
            orderedAt: { $exists: true }
        }
    });

    // Set the timezone for India (IST)
    const timezone = "Asia/Kolkata";

    let groupStage;
    switch (timeFrame) {
        case 'daily':
            groupStage = {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$orderedAt",
                            timezone: timezone
                        }
                    },
                    sales: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                    customers: { $addToSet: "$userId" }
                }
            };
            break;
        case 'weekly':
            groupStage = {
                $group: {
                    _id: {
                        year: { $year: { date: "$orderedAt", timezone: timezone } },
                        week: { $isoWeek: { date: "$orderedAt", timezone: timezone } }
                    },
                    sales: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                    customers: { $addToSet: "$userId" }
                }
            };
            break;
        case 'monthly':
            groupStage = {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$orderedAt",
                            timezone: timezone
                        }
                    },
                    sales: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                    customers: { $addToSet: "$userId" }
                }
            };
            break;
        case 'yearly':
            groupStage = {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y",
                            date: "$orderedAt",
                            timezone: timezone
                        }
                    },
                    sales: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                    customers: { $addToSet: "$userId" }
                }
            };
            break;
        default:
            throw new Error('Invalid time frame');
    }

    aggregationPipeline.push(groupStage);

    // Sort results
    aggregationPipeline.push({ $sort: { _id: 1 } });

    // Project final output
    aggregationPipeline.push({
        $project: {
            name: "$_id",
            sales: 1,
            orders: 1,
            customers: { $size: "$customers" },
            _id: 0
        }
    });

    try {
        const results = await orderSchema.aggregate(aggregationPipeline);



        // Handle empty results
        if (results.length === 0) {
            return [];
        }

        // Get current date in India timezone
        const todayIST = new Date();
        todayIST.setHours(todayIST.getHours() + 5); // Adjust for IST (UTC+5:30)
        todayIST.setMinutes(todayIST.getMinutes() + 30);

        // Create start date (January 1st of current year)
        const startOfYear = new Date(todayIST.getFullYear(), 0, 1); // January is 0

        // For filling in missing dates
        const filledResults = [];

        if (timeFrame === 'daily') {
            // Find min and max dates in results
            let dates = results.map(r => new Date(r.name));

            // Add today to ensure current day is included
            dates.push(todayIST);

            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));

            // Create map of existing results
            const resultMap = {};
            results.forEach(r => {
                resultMap[r.name] = r;
            });

            // Fill missing days
            const currentDate = new Date(minDate);
            while (currentDate <= maxDate) {
                const dateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

                if (resultMap[dateStr]) {
                    filledResults.push(resultMap[dateStr]);
                } else {
                    filledResults.push({
                        name: dateStr,
                        sales: 0,
                        orders: 0,
                        customers: 0
                    });
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

        } else if (timeFrame === 'weekly') {
            // Get the current week number
            const getWeekNumber = (d) => {
                // Copy date so don't modify original
                d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
                // Set to nearest Thursday: current date + 4 - current day number
                // Make Sunday's day number 7
                d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
                // Get first day of year
                const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                // Calculate full weeks to nearest Thursday
                const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
                return { year: d.getUTCFullYear(), week: weekNo };
            };

            const currentWeek = getWeekNumber(todayIST);
         

            // Get the week number for January 1st
            const firstWeek = getWeekNumber(startOfYear);
    

            // Create map of existing results
            const resultMap = {};
            results.forEach(r => {
                const key = `${r.name.year}-${r.name.week}`;
                resultMap[key] = r;
            });

            // Fill in all weeks from the first week of the year to the current week
            const year = todayIST.getFullYear();

            for (let week = firstWeek.week; week <= currentWeek.week; week++) {
                const key = `${year}-${week}`;

                if (resultMap[key]) {
                
                    filledResults.push(resultMap[key]);
                } else {
              
                    filledResults.push({
                        name: { year: year, week: week },
                        sales: 0,
                        orders: 0,
                        customers: 0
                    });
                }
            }

            // Sort by week number
            filledResults.sort((a, b) => {
                if (a.name.year !== b.name.year) {
                    return a.name.year - b.name.year;
                }
                return a.name.week - b.name.week;
            });



        } else if (timeFrame === 'monthly') {
            // Fill missing months, starting from January of current year
            const currentDate = new Date(startOfYear);

            // Create map of existing results
            const resultMap = {};
            results.forEach(r => {
                resultMap[r.name] = r;
            });

            while (currentDate <= todayIST) {
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const monthStr = `${year}-${month}`;

                if (resultMap[monthStr]) {
                    filledResults.push(resultMap[monthStr]);
                } else {
                    filledResults.push({
                        name: monthStr,
                        sales: 0,
                        orders: 0,
                        customers: 0
                    });
                }

                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        } else {
            // For yearly, just use the original results
            filledResults.push(...results);
        }

        // Convert results into readable format
        const formattedResults = filledResults.map(result => {
            switch (timeFrame) {
                case 'daily':
                    // Include full date to avoid duplicate days
                    const date = new Date(result.name);
                    // Format date using India's date format (DD/MM)
                    return {
                        name: `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${date.getDate()}/${date.getMonth() + 1}`,
                        fullDate: result.name, // Keep original date for reference
                        sales: result.sales,
                        orders: result.orders,
                        customers: result.customers
                    };
                case 'weekly':
                    // Format week with the date range for better clarity
                    let weekStart = getDateOfISOWeek(result.name.week, result.name.year);
                    let weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);

                    const formatDate = (date) => `${date.getDate()}/${date.getMonth() + 1}`;

                    return {
                        name: `Week ${result.name.week} (${formatDate(weekStart)}-${formatDate(weekEnd)})`,
                        year: result.name.year,
                        week: result.name.week,  // Keep week number for reference
                        sales: result.sales,
                        orders: result.orders,
                        customers: result.customers
                    };
                case 'monthly':
                    // Include year to avoid combining different Januaries
                    const monthDate = new Date(result.name + "-01");
                    return {
                        name: `${monthDate.toLocaleString('en-US', { month: 'short' })} ${monthDate.getFullYear()}`,
                        fullDate: result.name, // Keep original date string for reference
                        sales: result.sales,
                        orders: result.orders,
                        customers: result.customers
                    };
                case 'yearly':
                    return {
                        name: result.name,
                        sales: result.sales,
                        orders: result.orders,
                        customers: result.customers
                    };
            }
        });

        return formattedResults;

    } catch (error) {
        console.error('Error fetching sales data:', error.message);
        console.error('Stack trace:', error.stack);
        throw new Error('Failed to fetch sales data. Please try again.');
    }
};

// Helper function to get the first day of ISO week
function getDateOfISOWeek(week, year) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
}

const getDashboardData = async (req, res) => {
    try {
        // Parallel execution of dashboard data fetching
        const [
            dailyData,
            weeklyData,
            monthlyData,
            yearlyData,
            bestSellingProductsData,
            bestSellingCategoriesData,
            recentOrders
        ] = await Promise.all([
            getSalesDynamicData('daily'),
            getSalesDynamicData('weekly'),
            getSalesDynamicData('monthly'),
            getSalesDynamicData('yearly'),
            bestSellingProducts(),
            bestSellingCategories(),
            latestOrders()
        ]);


        // Calculate summary statistics
        const summaryStats = {
            totalSales: monthlyData.reduce((sum, item) => sum + item.sales, 0),
            totalOrders: monthlyData.reduce((sum, item) => sum + item.orders, 0),
            totalCustomers: monthlyData.reduce((sum, item) => sum + item.customers, 0),
            averageOrderValue: monthlyData.reduce((sum, item) => sum + item.sales, 0) /
                monthlyData.reduce((sum, item) => sum + item.orders, 0)
        };


        res.status(200).json({
            salesData: {
                daily: dailyData,
                weekly: weeklyData,
                monthly: monthlyData,
                yearly: yearlyData
            },
            bestSellingProductsData,
            bestSellingCategoriesData,
            recentOrders,
            summaryStats
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: 'Error fetching comprehensive dashboard data',
            error: error.message
        });
    }
};


module.exports = {
    adminLogin,
    adminLogout,
    adminRefresh,
    getDashboardData
}

// } rbac