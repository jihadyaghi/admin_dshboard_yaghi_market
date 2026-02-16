import { useEffect, useState } from "react";
function Admindashboard(){
const API = "http://localhost:5000";
const [catName, setCatName] = useState("");
const [catSection, setCatSection] = useState("supermarket");
const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [image, setImage] = useState("");
const [description, setDescription] = useState("");
const [section, setSection] = useState("supermarket");
const [isOffer, setIsOffer] = useState(false);
const [categoryId, setCategoryId] = useState("");
const [categories, setCategories] = useState([]);
const [products, setProducts] = useState([]);
const [message, setMessage] = useState("");
const [loadingProducts, setLoadingProducts] = useState(false);
const [uploading, setUploading] = useState(false);
const loadCategories = async (sec = "supermarket")=>{
    try{
        const res = await fetch (`${API}/api/categories?section=${sec}`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
    }
    catch(err){
        console.log(err);
        setCategories([]);
    }
    
};
const loadProducts = async (sec = "supermarket") =>{
    try{
        setLoadingProducts(true);
        const res = await fetch(`${API}/api/products?section=${sec}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
    }
    catch (err){
        console.log(err);
        setProducts([]);
    }
    finally{
        setLoadingProducts(false);
    }
}
useEffect(()=>{
    loadCategories("supermarket");
    loadProducts("supermarket");
}, []);
useEffect(()=>{
    loadCategories(section);
    loadProducts(section);
    setCategoryId("");
}, [section]);
const addCategory = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
        const res = await fetch(`${API}/api/categories`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: catName, section: catSection})
    });
    const data = await res.json();
    if(!res.ok){
        return setMessage(data.message || "Error adding category");
    }
    setMessage("Category added");
    setCatName("");
    if(catSection === section){
        loadCategories(section);
    }
    }
    catch (err){
        console.log(err);
        setMessage("Error adding category");
    }
    
};
const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try{
        const res = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            body: formData,
    });
    const data = await res.json();
    if (!res.ok){
        throw new Error(data.message || "Upload Failed");
    }
    return data.filename;
 }
catch(err){
    console.log(err)
}
}
const addProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
        console.log({
            name,
            price,
            image,
            section
        })
        const res = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name,
            price: Number(price),
            image,
            description,
            section,
            is_offer: isOffer ? 1:0,
            category_id: categoryId ? Number(categoryId): null
        })
    });
    const data = await res.json();
    if(!res.ok){
        return setMessage(data.message || "Error adding product");
    }
    setMessage("Product Added");
    setName("");
    setPrice("");
    setImage("");
    setDescription("");
    setIsOffer(false);
    setCategoryId("");
    loadProducts(section);
    }
    catch (err){
        console.log(err);
        setMessage("Error adding product")
    }
};
const deleteProduct = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
    setMessage("");
    try {
        const res = await fetch(`${API}/api/products/${id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        if (!res.ok){
            return setMessage(data.message || "Delete failed")
        }
        setMessage("Product deleted");
        loadProducts(section);
    }
    catch (err){
        console.log(err);
        setMessage("Delete failed");
    }
}
return(
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Add categories and prodcuts for Yaghi Market.</p>
            {message && (
                <div className="mt-4 p-3 rounded-xl bg-white border text-sm font-semibold">{message}</div>
            )}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form onSubmit={addCategory} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xl font-extrabold text-gray-900">Add New Category</h2>
                    <label className="block mt-4 text-sm font-semibold text-gray-700">Category name</label>
                    <input value={catName} 
                           onChange={(e)=>setCatName(e.target.value)}
                           className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-700"
                           placeholder="e.g. Dairy"
                           required/>
                    <label className="block mt-4 text-sm font-semibold text-gray-700">Section</label>
                    <select value={catSection}
                            onChange={(e)=>setCatSection(e.target.value)}
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200">
                                <option value="supermarket">Supermarket</option>
                                <option value="butchery">Butchery</option>
                                <option value="chicken">Chicken</option>
                            </select>
                            <button type="submit" className="mt-5 w-full py-3 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-800 transition">Add Category</button>
                </form>
                <form onSubmit={addProduct} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xl font-extrabold text-gray-900">Add New Product</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Name</label>
                            <input value={name}
                                   onChange={(e)=>setName(e.target.value)}
                                   className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200"
                                   placeholder="e.g. Milk 1L"
                                   required/>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Price</label>
                            <input type="number"
                                   step="0.01"
                                   value={price}
                                   onChange={(e)=>setPrice(e.target.value)}
                                   className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200"
                                   placeholder="e.g. 2.50"
                                   required/>
                        </div>
                    </div>
                    <label className="block mt-4 text-sm font-semibold text-gray-700">Product Image</label>
                    <input type="file"
                           accept="image/*"
                           onChange={async (e)=>{
                            const file = e.target.files?.[0];
                            if(!file) return;
                            setMessage("");
                            setUploading(true);
                            try {
                                const filename = await uploadImage(file);
                                setImage(filename);
                                setMessage("Image uploaded");
                            }
                            catch (err){
                                console.log(err);
                                setMessage(err.message || "Image upload failed");
                            }
                            finally {
                                setUploading(false);
                            }
                           }}
                           className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200"/>
                    <label className="block mt-4 text-sm font-semibold text-gray-700">Description</label>
                    <textarea value={description}
                              onChange={(e)=> setDescription(e.target.value)}
                              className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200"
                              rows={3}
                              placeholder="Short description"/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block mt-4 text-sm font-semibold text-gray-700">Section</label>
                            <select value={section}
                                    onChange={(e)=>setSection(e.target.value)}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200">
                                        <option value="supermarket">Supermarket</option>
                                        <option value="butchery">Butchery</option>
                                        <option value="chicken">Chicken</option>
                                    </select>
                        </div>
                        <div>
                            <label className="block mt-4 text-sm font-semibold text-gray-700">Category</label>
                            <select value={categoryId}
                                    onChange={(e)=>setCategoryId(e.target.value)}
                                    className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200">
                                        <option value="">(No Category)</option>
                                        {categories.map((c) =>(
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                        </div>
                    </div>
                            <label className=" mt-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <input type="checkbox"
                                       checked={isOffer}
                                       onChange={(e)=> setIsOffer(e.target.checked)}
                                       className="w-4 h-4 accent-red-700"/>
                                       Is Offer?
                            </label>
                            <button className="mt-5 w-full py-3 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-800 transtion">Add Product</button>
                </form>
            </div>
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-gray-900">Products({section})</h2>
                    <button onClick={()=>loadProducts(section)}className="px-4 py-2 rounded-xl border font-semibold hover:bg-gray-50">Refresh</button>
                </div>
                {loadingProducts ? (
                    <div className="p-6 text-gray-600">Loadin products...</div>
                ) : products.length === 0 ? (
                    <div className="p-6 text-gray-600">No Products found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="text-left p-3">Image</th>
                                    <th className="text-left p-3">Name</th>
                                    <th className="text-left p-3">Price</th>
                                    <th className="text-left p-3">Offer</th>
                                    <th className="text-left p-3">Category</th>
                                    <th className="text-right p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) =>(
                                    <tr className="border-t" key={p.id}>
                                        <td className="p-3">
                                            <img src={`${API}/images/${p.image}`}
                                                 alt={p.name}
                                                 className="w-12 h-12 rounded-lg object-cover border"/>
                                        </td>
                                        <td className="p-3 font-semibold text-gray-900">{p.name}</td>
                                        <td className="p-3">{p.price}</td>
                                        <td className="p-3">
                                            {Number(p.is_offer) === 1 ? (
                                                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-500 font-bold">Yes</span>
                                            ) : (
                                                <span className="text-gray-500 px-2 py-1">No</span>
                                            )}
                                        </td>
                                        <td className="p-3">{p.category_id ?? "-"}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={()=>deleteProduct(p.id)} className="px-3 py-2 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-800 transition">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    </div>
);
}
export default Admindashboard;