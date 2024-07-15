import { SpendViewModel } from "./ViewModel";

export interface SpendGroup{
    date: Date;
    spends: SpendViewModel[];
    total: number;
}

export interface User{
    id: number;
    firstName: string;
    lastName: string;
    createdAt: Date;
    deletedAt?: Date;
}

export interface Category{
    id: number;
    name: string;
    createdAt: Date;
    deletedAt?: Date;
}

export interface Spend{
    id: number;
    idCategory: number;
    amount: number;
    description?: string;
    date: Date;
    createdAt: Date;
    deletedAt?: Date;
}