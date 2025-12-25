import User from "../models/user.model.js";

export async function addAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const user = req.user;

    if(! fullName || !streetAddress || !city || !state || !zipCode || !phoneNumber || !label){
      return  res.status(400).json({
        status: "error",
        message: "All address fields are required",
      });
    }

    if (isDefault) {
      usrt.addresses.forEach((address) => {
        address.isDefault = false;
      });
    }

    const newAddress = {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    };

    usrt.addresses.push(newAddress);
    await usrt.save();

    res.status(201).json({
      status: "success",
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while adding the address",
    });
  }
}

export async function getAddresses(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ addresses: user.addresses });
  } catch (error) {}
}

export async function updateAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const { addressId } = req.params;
    const user = req.user;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }
    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
    
    await user.save();
    res.status(200).json({
        status: "success",
        message: "Address updated successfully",
        data: address,
        });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while updating the address",
    });
  }
}
export async function deleteAddress(req, res) {
    try {
        const { addressId } = req.params;
        const user = req.user;

        user.addAddress.pull(addressId);
        await user.save();

        res.status(200).json({
            status: "success",
            message: "Address deleted successfully",
        });

        
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while deleting the address",
        });
    }
}

export async function addToWishlist(req, res) {
    try {
        const { productId } = req.body;
        const user = req.user;
        
        if (user.wishlist.includes(productId)) {
            return res.status(400).json({
                status: "error",
                message: "Product already in wishlist",
            });
        }
        user.wishlist.push(productId);
        await user.save();
        res.status(200).json({
            status: "success",
            message: "Product added to wishlist",
            data: productId,
        });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while adding to the wishlist",
        });
    }
}

export async function removeFromWishlist(req, res) {
    try {
        const { productId } = req.params;
        const user = req.user;

      if (!user.wishlist.includes(productId)) {
            return res.status(400).json({
                status: "error",
                message: "Product not found in wishlist",
            });
        }
        user.wishlist.pull(productId);
        await user.save();
        res.status(200).json({
            status: "success",
            message: "Product removed from wishlist",
            data: productId,
        });
        
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while removing from the wishlist",
        });
    }
}
export async function getWishlist(req, res) {
    try {
       const user= await User.findById(req, res.user._id).populate("wishlist");
         res.status(200).json({
          status: "success",
          data: user.wishlist,
         }); 
    } catch (error) {
        console.error("Error getting wishlist:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while retrieving the wishlist",
        });
    }
}
