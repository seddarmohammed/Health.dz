// pages/api/getMainCategories.js
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
    try {
        const mainCategories = await prisma.medicalPractitioner.findMany({
            select: {
                mainCategory: true
            },
            distinct: ['mainCategory']
        });

        res.status(200).json(mainCategories);
    } catch (error) {
        console.error('Error fetching main categories:', error);
        res.status(500).json({ error: 'Failed to fetch main categories', details: error.message });
    }
}

