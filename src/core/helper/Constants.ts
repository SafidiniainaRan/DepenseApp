export enum FormMode{
    EDIT = 1,
    CREATE = 2
}

export const SPEND_DB = "spendDb";

export const USER = {
    TABLE : "user",
    COLUMNS : {
        ID : "id",
        FIRST_NAME: "first_name",
        LAST_NAME: "last_name",
        CREATED_AT: "created_At",
        DELETED_AT: "deleted_At"
    }
}

export const CATEGORY = {
    TABLE : "category",
    COLUMNS : {
        ID : "id",
        NAME: "name",
        CREATED_AT: "created_At",
        DELETED_AT: "deleted_At"
    }
}

export const SPEND = {
    TABLE : "spend",
    COLUMNS : {
        ID : "id",
        ID_CATEGORY: "id_category",
        AMOUNT: "amount",
        DESCRIPTION: "description",
        DATE: "date",
        CREATED_AT: "created_At",
        DELETED_AT: "deleted_At"
    }
}

export const MESSAGE = {
    SUCCESS : {
        CREATE : "Ajout a été effectué avec succès",
        EDIT : "Modification a été effectué avec succès",
        DELETE: "Suppression a été effectué avec succès"
    },
    ERROR : {
        GLOBAL: "Une erreur s'est produite. Veuillez réessayer plus tard.",
    }
}

export const CHART = {
    COLORS : ['rgb(75, 192, 192)','#3498db', '#2ecc71', '#95a5a6', '#9b59b6', '#e67e22', '#c0392b', '#f39c12', '#d98880', '#1abc9c', '#8e44ad', '#34495e', '#795548']
}