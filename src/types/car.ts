export interface ICar {
    id: number,
    seats: number
}

interface ICarItems extends Array<ICar>{};

export default ICarItems;