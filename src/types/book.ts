import { TextModel } from "./models"

export type Book = {
    id: string,
    coverImageUrl: string,
    text: string,
    is_paid: boolean,
    workflow: BookWorkflow
}

export type BookWorkflow = BookCreationOptions & {
    summary: string,
    outline: string
}

export type BookCreationOptions = {
    idea: string,
    type: 'summary' | 'outline',
    deliveryFormat: string,
    layout: string,
    artStyle: string,
    mood: string,
    lighting: string,
    colorPalette: string,
    textModel: TextModel,
    imageModel: string
}