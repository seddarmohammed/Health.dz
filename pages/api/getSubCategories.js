// pages/api/getSubCategories.js
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
    const { mainCategory } = req.query;

    if (!mainCategory) {
        return res.status(400).json({ error: 'Main category is required' });
    }

    try {
        const subCategories = await prisma.medicalPractitioner.findMany({
            where: {
                mainCategory: mainCategory
            },
            select: {
                subCategory: true
            },
            distinct: ['subCategory']
        });

        res.status(200).json(subCategories);
    } catch (error) {
        console.error('Error fetching sub categories:', error);
        res.status(500).json({ error: 'Failed to fetch sub categories', details: error.message });
    }
}