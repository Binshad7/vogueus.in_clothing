const walletSchema = require('../../models/wallet');

const userWalletDetail = async (req, res) => {
    const { userId } = req.params;

    if (userId !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    try {
        let userWallet = await walletSchema.findOne({ userId })

        if (!userWallet) {
            userWallet = await walletSchema.create({ userId, balance: 0, transactions: [] });
            return res.status(201).json({ success: true, message: 'Wallet Created', userWallet });
        }

        res.status(200).json({ success: true, message: 'Wallet Fetched', userWallet });
    } catch (error) {
        console.error("Error fetching wallet:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later" });
    }
};

module.exports = { userWalletDetail };
