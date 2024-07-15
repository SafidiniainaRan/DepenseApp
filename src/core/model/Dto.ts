export interface UserDto{
    id?: number;
    firstName: string;
    lastName: string;
}

export interface CategoryDto{
    id?: number;
    name: string;
}

export interface SpendDto{
    id?: number;
    idCategory: number;
    amount: number;
    date: Date;
    description?: string;
}