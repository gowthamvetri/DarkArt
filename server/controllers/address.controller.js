import { data } from "motion/react-client";
import AddressModel from "../models/address.model.js";
import UserModel from "../models/users.model.js";

export const addAddressController = async (req, res) => {
    try {
        const userId = req.userId; // Assuming user ID is stored in req.user
        // Validate request body
        const { address_line, city, state, pincode, country, mobile } = req.body;

        
        // Create a new address
        const newAddress = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId: userId, // Associate the address with the user
        });

        const savedAddress = await newAddress.save();
        
        const addAddressId = await UserModel.findByIdAndUpdate(userId,{
            $push: { 
                address_details: savedAddress._id 
            }
        });
        

        return res.status(201).json({
            message: "Address added successfully",
            success: true,
            address: savedAddress,
            data: savedAddress,
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding address", error:true,success:false });
    }
};

export const getAddressController = async (req, res) => {
    try {
        const userId = req.userId; // Assuming user ID is stored in req.user
        // Fetch all addresses for the user
        const addresses = await AddressModel.find({ userId: userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Addresses fetched successfully",
            success: true,
            addresses: addresses,
            data: addresses,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching addresses", error:true,success:false });
    }
};

