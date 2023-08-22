const cron = require('node-cron');
const RefreshToken = require('../models/RefreshToken');

const deleteOldRefreshToken = () => {
    cron.schedule('0 2 * * *', async () => {
        try {
            const cutoffTimestamp = new Date();
            cutoffTimestamp.setHours(cutoffTimestamp.getHours() - 72);
            await RefreshToken.deleteMany({ createdAt: { $lt: cutoffTimestamp } });
            console.log('Deleted old refresh tokens');
        } catch (error) {
            console.error('Error deleting old refresh tokens:', error);
        }
    });
};

module.exports = deleteOldRefreshToken;
