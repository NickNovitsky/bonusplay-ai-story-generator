export type Book = {
    id: string,
    coverImageUrl: string,
    text: string,
    is_paid: boolean,
    workflow: BookWorkflow
}

export type BookWorkflow = {
    idea: string,
    outline: string
}

export type BookIdea = {
    idea: string,
    deliveryFormat: string,
    layout: string,
    artStyle: string,
    mood: string,
    lighting: string,
    colorPalette: string
}