import axios from "axios"
import dayjs from "dayjs"
import {toast} from "react-toastify"


//specify the base url for our server
export const api = axios.create({
    baseURL: "http://localhost:8000",
});

//function to get all properties
//hit our api
export const getAllProperties = async () => {
    try {
        const response = await api.get("/api/residency/allresd", {
            timeout: 10 * 1000,
            });

        //timeout: 10 * 1000,
        if (response.status === 400 || response.status === 500)
        {
            throw response.data
        }

        return response.data
    } catch (error) {
        toast.error("Something went wrong");
        throw error;
    }
}


export const getProperty = async( id) => {
    try {
        const response = await api.get(`/api/residency/${id}`, {
            timeout: 10 * 1000,
            });

        if (response.status === 400 || response.status === 500)
        {
            throw response.data
        }

        return response.data
    } catch (error) {
        toast.error("Something went wrong");
        throw error;
    }
}

export const createUser = async (email) => {
  try {
    await api.post('/api/user/register', { email }
    );
  } catch (error) {
    console.error("User registration error:", error.response?.data || error.message);
    toast.error("Something went wrong. Please try again");
    throw error;
  }
}

export const bookVisit = async(date, propertyId, email) =>{
    try {
        await api.post(
            `/api/user/bookVisit/${propertyId}`,
            {
                email: email,
                id: propertyId,
                date: dayjs(date).format("DD/MM/YYYY"),
            }

        )
        
    } catch (error) {
        toast.error("Something went wrong, Please try again");
        throw error
        
    }
}

export const removeBooking = async (id, email) =>{
    try{

        await api.post(
            `/api/user/removeBooking/${id}`,
            {
                email,
            }
        );

    }catch(error)
    {
        toast.error("Something went wrong, Please try again");

        throw error
    }
}

export const toFav = async (id, email) =>{
    try{
        await api.post(
            `/api/user/toFav/${id}`,
            {
                email,
            }
        );
    } catch(e){
        throw e;
    }
}

export const getAllBookings = async (email) => {
    if (!email) return [];
    try{
        const res = await api.post(
            `/api/user/allBookings`,
            {
                email,
            }
        );
        return res.data["bookedVisits"];

    } catch (error){
        toast.error("Something went wrong while fetching bookings");
        throw error
    }
}

export const createResidency = async (data) => {
    try{
        const res = await api.post(
            `api/residency/create`,
            {
                data
            }
        )

    }catch(error)
    {
        throw error
    }
}