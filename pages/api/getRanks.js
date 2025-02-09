// pages/api/getRanks.js
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
    const { mainCategory, subCategory } = req.query;

    if (!mainCategory) {
        return res.status(400).json({ error: 'Main category is required' });
    }

    try {
        const whereClause = {
            mainCategory: mainCategory,
            ...(subCategory && { subCategory: subCategory })
        };

        const ranks = await prisma.medicalPractitioner.findMany({
            where: whereClause,
            select: {
                rank: true
            },
            distinct: ['rank']
        });

        // Filter out ranks with empty or invalid values
        const validRanks = ranks.filter((rank) => rank.rank && rank.rank.trim() !== "");

        res.status(200).json(validRanks);
    } catch (error) {
        console.error('Error fetching ranks:', error);
        res.status(500).json({ error: 'Failed to fetch ranks', details: error.message });
    }
}