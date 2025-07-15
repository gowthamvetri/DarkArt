import BundleModel from "../models/bundles.js";

// Create a new bundle
export const createBundleController = async (request, response) => {
    try {
        const {
            title,
            description,
            category,
            originalPrice,
            bundlePrice,
            discount,
            tag,
            items,
            isActive,
            featured,
            stock,
            images,
            metaTitle,
            metaDescription
        } = request.body;

        // Validate required fields
        if (!title || !category || !originalPrice || !bundlePrice || !items || items.length === 0) {
            return response.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            });
        }

        // Validate pricing
        if (bundlePrice >= originalPrice) {
            return response.status(400).json({
                message: "Bundle price must be less than original price",
                error: true,
                success: false
            });
        }

        // Calculate discount if not provided
        const calculatedDiscount = discount || Math.round(((originalPrice - bundlePrice) / originalPrice) * 100);

        // Generate unique slug
        const generateSlug = (title) => {
            return title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        };

        let slug = generateSlug(title);
        let counter = 1;
        
        // Check for duplicate slugs and append counter if needed
        while (await BundleModel.findOne({ slug })) {
            slug = `${generateSlug(title)}-${counter}`;
            counter++;
        }

        const bundle = new BundleModel({
            title,
            description,
            category,
            originalPrice,
            bundlePrice,
            discount: calculatedDiscount,
            tag,
            items,
            isActive: isActive !== undefined ? isActive : true,
            featured: featured || false,
            stock: stock || 100,
            images: images || [],
            metaTitle,
            metaDescription,
            slug // Explicitly set the unique slug
        });

        const savedBundle = await bundle.save();

        response.status(201).json({
            message: "Bundle created successfully",
            data: savedBundle,
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// Get all bundles with filtering and pagination
export const getBundlesController = async (request, response) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            isActive,
            featured,
            tag,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = request.query;

        // Build filter object
        const filter = {};
        
        if (category) filter.category = category;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (featured !== undefined) filter.featured = featured === 'true';
        if (tag) filter.tag = tag;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Get bundles with pagination
        const bundles = await BundleModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const totalBundles = await BundleModel.countDocuments(filter);
        const totalPages = Math.ceil(totalBundles / parseInt(limit));

        response.status(200).json({
            message: "Bundles retrieved successfully",
            data: bundles, // Return bundles directly as expected by frontend
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalBundles,
                hasNextPage: parseInt(page) < totalPages,
                hasPrevPage: parseInt(page) > 1
            },
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// Get bundle by ID
export const getBundleByIdController = async (request, response) => {
    try {
        const { bundleId } = request.params;

        const bundle = await BundleModel.findById(bundleId);

        if (!bundle) {
            return response.status(404).json({
                message: "Bundle not found",
                error: true,
                success: false
            });
        }

        response.status(200).json({
            message: "Bundle retrieved successfully",
            data: bundle,
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// Update bundle
export const updateBundleController = async (request, response) => {
    try {
        const { bundleId } = request.params;
        const updateData = request.body;

        // If prices are being updated, recalculate discount
        if (updateData.originalPrice || updateData.bundlePrice) {
            const bundle = await BundleModel.findById(bundleId);
            const originalPrice = updateData.originalPrice || bundle.originalPrice;
            const bundlePrice = updateData.bundlePrice || bundle.bundlePrice;
            
            if (bundlePrice >= originalPrice) {
                return response.status(400).json({
                    message: "Bundle price must be less than original price",
                    error: true,
                    success: false
                });
            }
            
            updateData.discount = Math.round(((originalPrice - bundlePrice) / originalPrice) * 100);
        }

        // If title is being updated, generate new unique slug
        if (updateData.title) {
            const generateSlug = (title) => {
                return title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            };

            let slug = generateSlug(updateData.title);
            let counter = 1;
            
            // Check for duplicate slugs (excluding current bundle)
            while (await BundleModel.findOne({ slug, _id: { $ne: bundleId } })) {
                slug = `${generateSlug(updateData.title)}-${counter}`;
                counter++;
            }
            
            updateData.slug = slug;
        }

        const updatedBundle = await BundleModel.findByIdAndUpdate(
            bundleId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedBundle) {
            return response.status(404).json({
                message: "Bundle not found",
                error: true,
                success: false
            });
        }

        response.status(200).json({
            message: "Bundle updated successfully",
            data: updatedBundle,
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// Delete bundle
export const deleteBundleController = async (request, response) => {
    try {
        const { bundleId } = request.params;

        const deletedBundle = await BundleModel.findByIdAndDelete(bundleId);

        if (!deletedBundle) {
            return response.status(404).json({
                message: "Bundle not found",
                error: true,
                success: false
            });
        }

        response.status(200).json({
            message: "Bundle deleted successfully",
            data: deletedBundle,
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// Toggle bundle active status
export const toggleBundleStatusController = async (request, response) => {
    try {
        const { bundleId } = request.params;

        const bundle = await BundleModel.findById(bundleId);

        if (!bundle) {
            return response.status(404).json({
                message: "Bundle not found",
                error: true,
                success: false
            });
        }

        bundle.isActive = !bundle.isActive;
        await bundle.save();

        response.status(200).json({
            message: `Bundle ${bundle.isActive ? 'activated' : 'deactivated'} successfully`,
            data: bundle,
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// Get featured bundles
export const getFeaturedBundlesController = async (request, response) => {
    try {
        const { limit = 6 } = request.query;

        const bundles = await BundleModel
            .find({ featured: true, isActive: true })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        response.status(200).json({
            message: "Featured bundles retrieved successfully",
            data: bundles,
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};

// Get bundle statistics
export const getBundleStatsController = async (request, response) => {
    try {
        const totalBundles = await BundleModel.countDocuments();
        const activeBundles = await BundleModel.countDocuments({ isActive: true });
        const featuredBundles = await BundleModel.countDocuments({ featured: true });
        
        const avgDiscount = await BundleModel.aggregate([
            { $group: { _id: null, avgDiscount: { $avg: "$discount" } } }
        ]);

        const avgRating = await BundleModel.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" } } }
        ]);

        const topCategories = await BundleModel.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        response.status(200).json({
            message: "Bundle statistics retrieved successfully",
            data: {
                totalBundles,
                activeBundles,
                featuredBundles,
                averageDiscount: avgDiscount[0]?.avgDiscount || 0,
                averageRating: avgRating[0]?.avgRating || 0,
                topCategories
            },
            error: false,
            success: true
        });

    } catch (error) {
        response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
};
