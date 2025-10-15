export class OrderParams {
    customerNameString: string;
    minValue = 0;
    maxValue = 100000;
    pageNumber = 1;
    pageSize = 5;
    orderBy = 'lastAdded';
    constructor(name: string) {
        this.customerNameString = name;
    }

}