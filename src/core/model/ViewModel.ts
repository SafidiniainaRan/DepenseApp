export interface UserViewModel{
    id: number;
    firstName: string;
    lastName: string;
}

export interface CategoryViewModel{
    id: number;
    name: string;
}

export interface SpendViewModel{
    id: number;
    idCategory: number;
    category: string;
    date: Date;
    amount: number;
    description?: string;
}

export interface SpendMonthlyViewModel{
    month: number;
    amount: number;
}
export interface SpendMonthlyGroupViewModel{
    category: string;
    amount: number;
}