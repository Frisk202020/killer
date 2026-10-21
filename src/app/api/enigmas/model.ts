export const buildGetBody = (id: number) => `id=${id}`;

export interface PostBody {
    id: number,
    content: string
}

export interface DeleteBody {
    id: number
}