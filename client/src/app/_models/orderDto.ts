export interface OrderDto {
    orderId: string,
    customerName: string,
    customerLastName: string,
    customerAddress: string,
    customerPhone: string,
    product: string,
    orderPrice: number,
    orderDate: Date,
    orderNotes: string,
    orderStatus: string,
    bonusAwarded: number
}