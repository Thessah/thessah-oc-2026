'use client'
import { addAddress, fetchAddress } from "@/lib/features/address/addressSlice"

import axios from "axios"
import { XIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"

import { useAuth } from '@/lib/useAuth';
import { isUAECountry, uaeEmirates } from "@/assets/uaeEmirates";
import JewelrySelect from "@/components/JewelrySelect";

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh" 
];
const keralaDistricts = [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"
];

const AddressModal = ({ open, setShowAddressModal, onAddressAdded, initialAddress = null, isEdit = false, onAddressUpdated }) => {
    const { user, getToken } = useAuth()
    const dispatch = useDispatch()

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        district: '',
        zip: '',
        country: 'United Arab Emirates',
        phone: '',
        phoneCode: '+971',
        id: null,
    })

    // Prefill when editing
    useEffect(() => {
        if (isEdit && initialAddress) {
            setAddress({
                id: initialAddress.id || initialAddress._id || null,
                name: initialAddress.name || '',
                email: initialAddress.email || '',
                street: initialAddress.street || '',
                city: initialAddress.city || '',
                state: initialAddress.state || '',
                district: initialAddress.district || '',
                zip: initialAddress.zip || '',
                country: initialAddress.country || 'United Arab Emirates',
                phone: initialAddress.phone || '',
                phoneCode: initialAddress.phoneCode || '+971',
            })
        }
    }, [isEdit, initialAddress])

    const countries = [
        { name: 'United Arab Emirates', code: '+971' },
        { name: 'India', code: '+91' },
        { name: 'Saudi Arabia', code: '+966' },
        { name: 'Qatar', code: '+974' },
        { name: 'Kuwait', code: '+965' },
        { name: 'Bahrain', code: '+973' },
        { name: 'Oman', code: '+968' },
        { name: 'Pakistan', code: '+92' },
    ];

    const handleAddressChange = (e) => {
        const { name, value } = e.target
        if (name === 'country') {
            const selectedCountry = countries.find(c => c.name === value)
            setAddress({
                ...address,
                country: value,
                state: '',
                district: '',
                phoneCode: selectedCountry?.code || '+971'
            })
        } else {
            setAddress({
                ...address,
                [name]: value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!user || !user.uid) {
                toast.error('User not authenticated. Please sign in again.');
                return;
            }
            
            const token = await getToken()
            
            // Prepare address data with userId from authenticated user
            const addressData = { ...address, userId: user.uid };
            
            if (!addressData.zip || addressData.zip.trim() === '') {
                delete addressData.zip
            }
            // Remove district if not present or empty (to match Prisma schema)
            if (!addressData.district) {
                delete addressData.district;
            }
            
            console.log('AddressModal - Sending address:', addressData);
            
            if (isEdit && addressData.id) {
                const { data } = await axios.put('/api/address', { id: addressData.id, address: addressData }, { headers: { Authorization: `Bearer ${token}` } })
                toast.success(data.message || 'Address updated')
                if (onAddressUpdated) {
                    onAddressUpdated(data.updated)
                }
            } else {
                const { data } = await axios.post('/api/address', {address: addressData}, {headers: { Authorization: `Bearer ${token}` } })
                dispatch(addAddress(data.newAddress))
                // Immediately refresh address list in Redux after adding
                dispatch(fetchAddress({ getToken }))
                toast.success(data.message)
                if (onAddressAdded) {
                    onAddressAdded(data.newAddress);
                }
            }
            setShowAddressModal(false)
            // Reset form state after save
            setAddress({
                name: '',
                email: '',
                street: '',
                city: '',
                state: '',
                district: '',
                zip: '',
                country: 'United Arab Emirates',
                phone: '',
                phoneCode: '+971',
                id: null,
            })
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.error || error?.response?.data?.message || error.message)
        }
    }

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto my-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit' : 'Add New'} <span className="text-blue-600">Address</span></h2>
                    <button type="button" onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                        <XIcon size={24} />
                    </button>
                </div>
                <form onSubmit={e => toast.promise(handleSubmit(e), { loading: 'Adding Address...' })} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input 
                            name="name" 
                            onChange={handleAddressChange} 
                            value={address.name} 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                            type="text" 
                            placeholder="Enter your name" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <input 
                            name="email" 
                            onChange={handleAddressChange} 
                            value={address.email} 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                            type="email" 
                            placeholder="Email address" 
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
                        <input 
                            name="street" 
                            onChange={handleAddressChange} 
                            value={address.street} 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                            type="text" 
                            placeholder="Street" 
                            required 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                            <input 
                                name="city" 
                                onChange={handleAddressChange} 
                                value={address.city} 
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                type="text" 
                                placeholder="City" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                {isUAECountry(address.country) ? "Emirate" : "State"}
                            </label>
                            <JewelrySelect
                                name="state"
                                onChange={handleAddressChange}
                                value={address.state}
                                required
                                placeholder={isUAECountry(address.country) ? "Select Emirate" : "Select State"}
                                options={(isUAECountry(address.country) ? uaeEmirates : indianStates).map((state) => ({
                                    value: state,
                                    label: state,
                                }))}
                            />
                        </div>
                    </div>
                    {address.country === "India" && address.state === "Kerala" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">District</label>
                            <JewelrySelect
                                name="district"
                                onChange={handleAddressChange}
                                value={address.district}
                                required
                                placeholder="Select District"
                                options={keralaDistricts.map((district) => ({
                                    value: district,
                                    label: district,
                                }))}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Zip/Postal Code (Optional)</label>
                        <input 
                            name="zip" 
                            onChange={handleAddressChange} 
                            value={address.zip} 
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                            type="text" 
                            placeholder="Postal code" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                        <JewelrySelect
                            name="country"
                            onChange={handleAddressChange}
                            value={address.country}
                            required
                            options={countries.map((country) => ({
                                value: country.name,
                                label: country.name,
                            }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                        <div className="flex gap-2">
                            <JewelrySelect
                                name="phoneCode"
                                onChange={handleAddressChange}
                                value={address.phoneCode}
                                required
                                className="w-[110px] shrink-0"
                                options={countries.map((country) => ({
                                    value: country.code,
                                    label: country.code,
                                }))}
                            />
                            <input 
                                name="phone" 
                                onChange={handleAddressChange} 
                                value={address.phone} 
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" 
                                type="tel" 
                                placeholder="501234567" 
                                required 
                                pattern="[0-9]{9,10}"
                                title="Please enter a valid phone number"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter phone number without country code</p>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button 
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                        >
                            {isEdit ? 'SAVE CHANGES' : 'SAVE ADDRESS'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => setShowAddressModal(false)}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 rounded-lg transition-colors"
                        >
                            CANCEL
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddressModal