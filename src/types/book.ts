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