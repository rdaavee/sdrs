import { Request, Response } from "express";
import { DocumentModel } from "../models/document.model";

export const getDocuments = async (req: Request, res: Response) => {
    try {
        const docs = await DocumentModel.find();
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch documents", error });
    }
};

export const createDocument = async (req: Request, res: Response) => {
    try {
        const { category, name, fee, active } = req.body;
        const newDoc = new DocumentModel({ category, name, fee, active });
        await newDoc.save();
        res.status(201).json(newDoc);
    } catch (error) {
        res.status(400).json({ message: "Failed to create document", error });
    }
};

export const updateDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedDoc = await DocumentModel.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedDoc) return res.status(404).json({ message: "Document not found" });
        res.json(updatedDoc);
    } catch (error) {
        res.status(400).json({ message: "Failed to update document", error });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedDoc = await DocumentModel.findByIdAndDelete(id);
        if (!deletedDoc) return res.status(404).json({ message: "Document not found" });
        res.json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete document", error });
    }
};
