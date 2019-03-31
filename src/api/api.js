import { get, post, postForm } from '@/util/http';
export const test = () => get('/');
export const login = params => postForm('login', params);
export const reg = params => post('reg', params);
export const hotSale = () => post('hotsale');
export const saleGroup = () => post('salegroup');
export const discover = () => post('discover');
export const getCartCount = () => post('getCartCount');
export const getCart = () => post('getCart');
export const updateCartCount = params => post('updateCartCount', params);
export const addToCart = params => post('addToCart', params);
export const delFromCart = params => post('delFromCart', params);
export const getGoodById = params => post('getGoodById', params);
export const cors = () => post('cors');
export const welcome = () => get('welcome');

export const getMeInfo = () => post('me');
export const logout = () => get('logout');
export const getSellerInfo = params => post('sellerInfo', params);

export const listBook = params => post('listBook', params);
export const listSellerBook = params => post('listSellerBook', params);
export const getBook = params => post('getBookInfo', params);

export const getAddress = () => post('getAddress');
export const updateAddress = params => post('/updateAddress', params);
export const addAddress = params => post('/addAddress', params);
export const removeAddress = params => post('/removeAddress', params);

export const createOrder = params => post('createOrder', params);
export const getOrder = params => post('listOrder', params);
export const getOrderInfo = params => post('getOrderInfo', params);
