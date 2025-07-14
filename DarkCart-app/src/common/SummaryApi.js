export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {
    register:{
        url: "/api/user/register",
        method: 'post'
    },
    login :{
        url: "/api/user/login",
        method: 'post'
    },
    googleSignIn: {
        url: "/api/user/google-signin",
        method: 'post'
    },
    forgetPassword :{
        url: "/api/user/forgot-password",
        method: 'put'
    },
    forgetPasswordVerify :{
        url: "/api/user/verify-forgot-password-otp",
        method: 'put'
    },
    resetPassword :{
        url: "/api/user/reset-password",
        method: 'put'
    },
    refreshToken :{
        url: "/api/user/refresh-token",
        method: 'post'
    },
    userDetails :{
        url: "/api/user/user-details",
        method: 'get'
    },
    userLogOut:{
        url : '/api/user/logout',
        method : 'get',
    },
    uploadAvatar:{
        url:"/api/user/upload-avatar",
        method:"put"
    },
    UpdateUser:{
        url:"api/user/update-user",
        method:"put"
    },
    addCategory:{
        url:"api/category/add-category",
        method:"post"
    },
    uploadImage:{
        url:"/api/file/upload",
        method:"post"
    },
    getCategory:{
        url:'api/category/get',
        method:"get"
    },
    updateCategory :{
        url:'api/category/update',
        method:"put"
    },
    deleteCategory : {
        url : '/api/category/delete',
        method : 'delete'
    },
    createProduct :{
        url :"/api/product/create",
        method : "post"
    },
    getProduct :{
        url :"/api/product/get",
        method : "post"
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    addToCart : {
        url : '/api/cart/create',
        method : 'post'
    },
    getCart : {
        url : '/api/cart/get',
        method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty',
        method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    editAddress : {
        url : '/api/address/edit',
        method : 'put'
    },
    deleteAddress : {
        url : '/api/address/delete',
        method : 'delete'
    },
    CashOnDeliveryOrder:{
        url: '/api/order/cash-on-delivery',
        method: 'post'
    },getOrderList:{
        url: '/api/order/get',
        method: 'get'
    },getAllOrders:{
        url: '/api/order/all-orders',
        method: 'get'
    },cancelOrder:{
        url: '/api/order/cancel',
        method: 'post'
    },    updateOrderStatus:{
        url: '/api/order/update-order-status',
        method: 'put'
    },
    // Bundle API endpoints
    createBundle: {
        url: '/api/bundle/create',
        method: 'post'
    },
    getBundles: {
        url: '/api/bundle',
        method: 'get'
    },
    getBundleById: {
        url: '/api/bundle',
        method: 'get'
    },
    updateBundle: {
        url: '/api/bundle/update',
        method: 'put'
    },
    deleteBundle: {
        url: '/api/bundle/delete',
        method: 'delete'
    },
    toggleBundleStatus: {
        url: '/api/bundle/toggle-status',
        method: 'patch'
    },
    getFeaturedBundles: {
        url: '/api/bundle/featured',
        method: 'get'
    },
    getBundleStats: {
        url: '/api/bundle/admin/stats',
        method: 'get'
    },
    // Wishlist API endpoints
    addToWishlist: {
        url: '/api/wishlist/add',
        method: 'post'
    },
    removeFromWishlist: {
        url: '/api/wishlist/remove',
        method: 'post'
    },
    getWishlist: {
        url: '/api/wishlist/get',
        method: 'get'
    },
    checkWishlistItem: {
        url: '/api/wishlist/check',
        method: 'get'
    },
    clearWishlist: {
        url: '/api/wishlist/clear',
        method: 'delete'
    }
}

export default SummaryApi;