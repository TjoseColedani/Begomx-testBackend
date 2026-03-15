import { Request, Response } from 'express';
import axios from 'axios';
import { Location } from '../models/location.model';

export const getLocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const locations = await Location.find();
        res.status(200).json({ success: true, data: locations });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const getLocationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            res.status(404).json({ success: false, data: { message: 'Location not found' } });
            return;
        }
        res.status(200).json({ success: true, data: location });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const createLocation = async (req: any, res: Response): Promise<void> => {
    try {
        const { place_id } = req.body;
        const userId = req.user.id;

        const existingLocation = await Location.findOne({ place_id });
        if (existingLocation) {
            res.status(400).json({ success: false, data: { message: 'Location with this place_id already exists' } });
            return;
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            res.status(500).json({ success: false, data: { message: 'Google Maps API key is not configured' } });
            return;
        }

        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}`);

        if (response.data.status !== 'OK') {
            res.status(400).json({ success: false, data: { message: 'Failed to retrieve location from Google Maps', details: response.data.error_message } });
            return;
        }

        const { formatted_address, geometry } = response.data.result;
        const latitude = geometry.location.lat;
        const longitude = geometry.location.lng;

        const location = await Location.create({
            user: userId,
            place_id,
            address: formatted_address,
            latitude,
            longitude
        });

        res.status(201).json({ success: true, data: location });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        // usually standard PUT shouldn't be fully allowed if place_id dictates geocoords natively, 
        // but we keep standard RESTful update intact for potential address overrides.
        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!location) {
            res.status(404).json({ success: false, data: { message: 'Location not found' } });
            return;
        }
        res.status(200).json({ success: true, data: location });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};

export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            res.status(404).json({ success: false, data: { message: 'Location not found' } });
            return;
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, data: { message: error.message } });
    }
};
