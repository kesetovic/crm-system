export interface AddOrderDto {
    customerName: string,
    customerLastName: string,
    customerAddress: string,
    customerPhone: string,
    product: string,
    orderPrice: number,
    orderNotes: string,
}