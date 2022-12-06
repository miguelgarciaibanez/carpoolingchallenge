export interface ICar {
    id: number,
    seats: number
}

interface ICarItems extends Map<number,ICar>{};

export default ICarItems;